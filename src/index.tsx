import React from 'react'
import ReactDOM from 'react-dom'
import { BitmapFont, Loader } from 'pixi.js'
import { clearTextureCache } from '@pixi/utils'
import { Scenes, SoundPath } from './const'
import { ImagesProvider } from './assets-provider'
import { Menu } from './views/Menu'
import { GameComponent } from './views/GameComponent'
import { LevelChoice } from './views/LevelChoice'
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
                    <Menu
                        elements={[
                            { label: 'Level Choice', onClick: () => this.changeScene(Scenes.LEVELS_CHOICE) },
                            { label: 'Campaign', onClick: () => this.changeScene(Scenes.CAMPAIGN) },
                            { label: 'Bonus Levels', onClick: () => this.changeScene(Scenes.BONUS) },
                            { label: 'Scoreboard', onClick: () => this.changeScene(Scenes.SCOREBOARD) },
                            { label: 'Options', onClick: () => this.changeScene(Scenes.OPTIONS) }
                        ]}
                    />,
                    <LevelChoice
                        mode={'choice'}
                        saved={false}
                        onLevelClick={() => this.changeScene(Scenes.GAME)}
                        onExit={() => this.changeScene(Scenes.MAIN_MENU)}
                    />,
                    <LevelChoice
                        mode={'campaign'}
                        saved={false}
                        onLevelClick={() => this.changeScene(Scenes.GAME)}
                        onExit={() => this.changeScene(Scenes.MAIN_MENU)}
                        onSavedGamesClick={() => this.changeScene(Scenes.CAMPAIGN_SAVED)}
                    />,
                    <LevelChoice
                        mode={'bonus'}
                        saved={false}
                        onLevelClick={() => this.changeScene(Scenes.GAME)}
                        onExit={() => this.changeScene(Scenes.MAIN_MENU)}
                        onSavedGamesClick={() => this.changeScene(Scenes.BONUS_SAVED)}
                    />,
                    <LevelChoice
                        mode={'campaign'}
                        saved={true}
                        onLevelClick={() => this.changeScene(Scenes.GAME)}
                        onExit={() => this.changeScene(Scenes.CAMPAIGN)}
                    />,
                    <LevelChoice
                        mode={'bonus'}
                        saved={true}
                        onLevelClick={() => this.changeScene(Scenes.GAME)}
                        onExit={() => this.changeScene(Scenes.BONUS)}
                    />,
                    <div></div>,
                    <div></div>,
                    <GameComponent
                        onFinish={() => this.changeScene(Scenes.MAIN_MENU)}
                        mode={'easy'}
                        levelName={'easy 0'}
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