import React from 'react'
import ReactDOM from 'react-dom'
import { BitmapFont, Loader } from 'pixi.js'
import { clearTextureCache } from '@pixi/utils'
import { Scenes, SoundPath } from './const'
import { ImagesProvider } from './assets-provider'
import { Menu } from './views/Menu'
import { GameComponent } from './views/GameComponent'
import './style.css'

// Inaczej dźwięk nie działa (czemu? pojęcia nie mam).
import { Sound } from '@pixi/sound'
Sound

class UI extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            scene: 0
        }

        this.changeScene = this.changeScene.bind(this)
    }

    override render = () => {
        return <div className='ui'>
            {
                [
                    <GameComponent
                        onFinish={() => this.changeScene(Scenes.MAIN_MENU)}
                        mode={'easy'}
                        levelName={'easy 0'}
                    />,
                    <Menu
                        elements={[
                            { label: 'Level Choice', onClick: () => this.changeScene(Scenes.GAME) },
                            { label: 'Campaign', onClick: () => this.changeScene(Scenes.GAME) },
                            { label: 'Bonus Levels', onClick: () => this.changeScene(Scenes.GAME) },
                            { label: 'Scoreboard', onClick: () => {  } },
                            { label: 'Options', onClick: () => {  } }
                        ]}
                    />
                ][this.state.scene]
            }
        </div>
    }

    changeScene = (newScene: Scenes) => {
        this.setState({
            scene: newScene
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