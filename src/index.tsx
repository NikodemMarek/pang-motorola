import React from 'react'
import ReactDOM from 'react-dom'
import { BitmapFont, Loader } from 'pixi.js'
import { clearTextureCache } from '@pixi/utils'
import { Scenes, SoundPath } from './const'
import { ImagesProvider } from './assets-provider'
import { Menu } from './views/Menu'
import { GameComponent } from './views/GameComponent'
import { LevelChoice } from './views/LevelChoice'
import { Scoreboard } from './views/Scoreboard'
import { Options } from './views/Options'
import { readScoreboard } from './scoreboard'
import './style.css'

// Inaczej dźwięk nie działa (czemu? pojęcia nie mam).
import { Sound } from '@pixi/sound'
Sound

/**
 * Główny ui aplikacji.
 */
class UI extends React.Component<any, any> {
    /**
     * Wybrany moduł rozgrywki.
     * Dostępne: choice - moduł 1, campaign - moduł 2, bonus - moduł 3.
     */
    chosenMode: string = 'choice'
    /**
     * Id wybranego poziomu.
     */
    chosenLevelId: string = 'Easy 1'

    /**
     * Initializuje ui.
     * 
     * @param props - Właściwości ui
     */
    constructor(props: any) {
        super(props)
        this.state = {
            scene: Scenes.MAIN_MENU,
            loadedSet: 1
        }

        this.changeScene = this.changeScene.bind(this)
    }

    /**
     * Renderuje ui aplikacji.
     * 
     * @returns Ui
     */
    override render = () => {
        return <div className='ui'>
            {
                [
                    <Menu
                        elements={[
                            { label: 'Level Choice', onClick: () => this.changeScene(Scenes.LEVELS_CHOICE) },
                            { label: 'Campaign', onClick: () => this.changeScene(Scenes.CAMPAIGN) },
                            { label: 'Bonus Levels', onClick: () => this.changeScene(Scenes.BONUS) },
                            readScoreboard('campaign').length > 0? { label: 'Scoreboard', onClick: () => this.changeScene(Scenes.SCOREBOARD) }: null,
                            { label: 'Options', onClick: () => this.changeScene(Scenes.OPTIONS) }
                        ]}
                    />,
                    <LevelChoice
                        mode={'choice'}
                        saved={false}
                        onLevelClick={(levelName) => {
                            this.chosenMode = 'choice'
                            this.chosenLevelId = levelName

                            this.changeScene(Scenes.GAME)
                        }}
                        onExit={() => this.changeScene(Scenes.MAIN_MENU)}
                    />,
                    <LevelChoice
                        mode={'campaign'}
                        saved={false}
                        onLevelClick={(levelName) => {
                            this.chosenMode = 'campaign'
                            this.chosenLevelId = levelName

                            this.changeScene(Scenes.GAME)
                        }}
                        onExit={() => this.changeScene(Scenes.MAIN_MENU)}
                        onSavedGamesClick={() => this.changeScene(Scenes.CAMPAIGN_SAVED)}
                    />,
                    <LevelChoice
                        mode={'bonus'}
                        saved={false}
                        onLevelClick={(levelName) => {
                            this.chosenMode = 'bonus'
                            this.chosenLevelId = levelName

                            this.changeScene(Scenes.GAME)
                        }}
                        onExit={() => this.changeScene(Scenes.MAIN_MENU)}
                        onSavedGamesClick={() => this.changeScene(Scenes.BONUS_SAVED)}
                    />,
                    <LevelChoice
                        mode={'campaign'}
                        saved={true}
                        onLevelClick={(levelName) => {
                            this.chosenMode = 'saved-campaign'
                            this.chosenLevelId = levelName

                            this.changeScene(Scenes.GAME)
                        }}
                        onExit={() => this.changeScene(Scenes.CAMPAIGN)}
                    />,
                    <LevelChoice
                        mode={'bonus'}
                        saved={true}
                        onLevelClick={(levelName) => {
                            this.chosenMode = 'saved-bonus'
                            this.chosenLevelId = levelName
                            
                            this.changeScene(Scenes.GAME)
                        }}
                        onExit={() => this.changeScene(Scenes.BONUS)}
                    />,
                    <Scoreboard
                        mode={'campaign'}
                        onExit={() => this.changeScene(Scenes.MAIN_MENU)}
                    />,
                    <Options
                        onExit={() => this.changeScene(Scenes.MAIN_MENU)}
                        onLoad={(set: number) => {
                            setup(set)

                            this.setState({
                                loadedSet: set
                            })
                        }}
                        loadedSet={this.state.loadedSet}
                    />,
                    <GameComponent
                        onFinish={() => this.changeScene(Scenes.MAIN_MENU)}
                        mode={this.chosenMode}
                        levelId={this.chosenLevelId}
                    />
                ][this.state.scene]
            }
        </div>
    }

    /**
     * Zmienia wyświetlaną scenę.
     * 
     * @param newScene - Nowa scena
     */
    changeScene = (newScene: Scenes) => {
        this.setState({
            scene: newScene
        })
    }
}

/**
 * Wczytuje zestaw grafik.
 * Wczytuje dźwięki.
 * 
 * @param set - Zestaw grafik do wczytania
 * @returns Promise wczytujący grę
 */
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

/**
 * Uruchamia aplikację.
 */
setup(1).then(() => {
    ReactDOM.render(
        <UI />,
        document.getElementById('root')
    )
})