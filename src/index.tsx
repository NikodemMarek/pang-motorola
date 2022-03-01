import { Application, BitmapFont, Loader } from 'pixi.js'
import React from 'react'
import ReactDOM from 'react-dom'
import { RENDERER_SIZE, SoundPath } from './const'
import { getLevel, loadLevel, getLevelsList } from './levels-provider'
import { clearTextureCache } from '@pixi/utils'
import { ImagesProvider } from './assets-provider'
import './style.css'
import { SceneManager } from 'pixi-scenes'
import GameScene from './views/game-scene'
import { Menu } from './views/Menu'

// Inaczej dźwięk nie działa (czemu? pojęcia nie mam).
import { Sound } from '@pixi/sound'
Sound

class GameComponent extends React.Component<any, any> {
    pixiCtx: any
    app: Application
    scenes: SceneManager

    constructor(props: any) {
        super(props)

        this.pixiCtx = null
        this.app = new Application({
            view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0xffffff,
            width: RENDERER_SIZE.x,
            height: RENDERER_SIZE.y
        })
        this.scenes = new SceneManager(this.app)
    }

    override render = () => { 
        return <div ref={this.updatePixiCtx}></div>
    }

    updatePixiCtx = async (element: any) => {
        this.pixiCtx = element

        if(this.pixiCtx && this.pixiCtx.children.length<=0) await this.initialize()
    }

    initialize = async () => {
        this.pixiCtx.appendChild(this.app.view)

        const rawLevel = await loadLevel('easy', getLevelsList('easy')[0].name)
        const level = getLevel(rawLevel)

        const gameScene = new GameScene(
            (won?: boolean) => {
                console.log(won)
            },
        )
        gameScene.setLevel(level)
        this.scenes.add('game', gameScene)
        this.scenes.start('game')
        gameScene.startGame()
    }
}

class UI extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            play: false
        }

        this.switchPlay = this.switchPlay.bind(this)
    }

    override render = () => {
        return <div className='ui'>
            {
                this.state.play
                ? <GameComponent
                    app={
                        new Application({
                            view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
                            resolution: window.devicePixelRatio || 1,
                            autoDensity: true,
                            backgroundColor: 0xffffff,
                            width: RENDERER_SIZE.x,
                            height: RENDERER_SIZE.y
                        })
                    }
                />
                : <Menu
                    buttons={[
                        { label: 'Level Choice', onClick: this.switchPlay },
                        { label: 'Campaign', onClick: this.switchPlay },
                        { label: 'Bonus Levels', onClick: this.switchPlay },
                        { label: 'Scoreboard', onClick: () => {  } },
                        { label: 'Options', onClick: () => {  } }
                    ]}
                />
            }
        </div>
    }

    switchPlay = () => {
        this.setState({
            play: !this.state.play
        })
    }
}

const setup = async (set: number) => {
    BitmapFont.from('buttonLabelFont', {
        fontFamily: 'Noto Sans',
        fill: 0xffffff,
        fontSize: 30
    })
    
    clearTextureCache()
    
    const provider = ImagesProvider.Instance()
    provider.loadSet(set)

    return new Promise((resolve, reject) => {
        const loader = Loader.shared
        loader.reset()

        loader.add(provider.path!)
        ;[
            SoundPath.BALL_POP,
            SoundPath.LIVE_LOST,
            SoundPath.SHOT,
            SoundPath.VICTORY,
            SoundPath.BONUS_COLLECTED_1,
            SoundPath.BONUS_COLLECTED_2,
            SoundPath.POINT_COLLECTED
        ].forEach(sound => loader.add(sound, sound))

        loader.load()

        loader.onComplete.once(() => resolve(true))
        loader.onError.once(() => reject(false))
    })
}
setup(1).then(() => {
    ReactDOM.render(
        <UI />,
        document.getElementById('root')
    )
})