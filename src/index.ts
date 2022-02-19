import { clearTextureCache } from '@pixi/utils'
import { Application, BitmapFont, Loader } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { RENDERER_SIZE } from './const'
import { getLevel, getLevelsList, loadLevel, rawLevel, readGame, removeGame, savedGamesList, saveGame } from './levels-provider'
import { addToScoreboard, readScoreboard } from './scoreboard'
import { Level, LevelData } from './types'
import GameScene from './views/scenes/game-scene'
import LevelChoiceScene from './views/scenes/level-choice-scene'
import LevelsMenuScene from './views/scenes/levels-menu-scene'
import MainMenuScene from './views/scenes/main-menu-scene'
import OptionsMenuScene from './views/scenes/options-menu-scene'
import { ScenesNavigator } from './views/scenes/scenes-navigator'

const onNicknameConfirm = (nickname: string) => {
    /**
     * Tworzy aplikację we wskazanym kontenerze i określa dodatkowe parametry aplikacji.
     */
    const app = new Application({
        view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundColor: 0xffffff,
        width: RENDERER_SIZE.x,
        height: RENDERER_SIZE.y
    })
    
    const loadAssets = async (set: number) => {
        clearTextureCache()
        
        const provider = ImagesProvider.Instance()
        provider.loadSet(set)
    
        return new Promise((resolve, reject) => {
            const loader = Loader.shared
            loader.reset()
            loader.add(provider.path!)
            loader.load()
    
            loader.onComplete.once(() => resolve(true))
            loader.onError.once(() => reject(false))
        })
    }
    const loadGameLevel = async (mode: string, levelName: string): Promise<LevelData> => getLevel(await loadLevel(mode, levelName))
    
    const addGame = async (levelData: LevelData, saveTo?: string) => {
        scenes.remove('game')
        
        const gameScene = new GameScene(
            () => {
                scenes.pop()
    
                if(saveTo != undefined && saveTo == 'campaign') {
                    addToScoreboard('campaign', nickname, gameScene.getScore())
                    refreshScoreboard()
                }
            },
            saveTo != undefined? game => {
                scenes.remove('save-game')

                const savedGames = savedGamesList(saveTo)
                const saveGamesScene = new LevelsMenuScene(
                    Array(9).fill('').map((_, i) => savedGames[i] || 'empty'),
                    async saveName => {
                        removeGame(saveTo, saveName)
                        saveGame(saveTo, nickname, rawLevel({
                            level: {
                                players: game.players,
                                balls: game.balls,
                                bullets: game.bullets,
                                powerUps: game.powerUps,
                                points: game.points,
                                platforms: game.platforms,
                                ladders: game.ladders
                            } as Level,
                            info: {
                                time: game.time,
                                score: game.score,
                                hourglassTimeLeft: game.hourglassTimeLeft,
                                clockTimeLeft: game.clockTimeLeft
                            },
                            name: levelData.name
                        } as LevelData))
    
                        scenes.pop()
                    },
                    () => { scenes.pop() }
                )
        
                scenes.add('save-game', saveGamesScene)
                scenes.start('save-game')
            }: undefined,
            saveTo != undefined && saveTo == 'campaign'? async () => {
                const nextLevelNumber = parseInt(levelData.name.slice(0, 2))
    
                if(nextLevelNumber >= getLevelsList('campaign').length) {
                    addToScoreboard('campaign', nickname, gameScene.totalScore)
                    refreshScoreboard()
                    scenes.start('main-menu')
                } else {
                    const level = await loadGameLevel('campaign', getLevelsList('campaign')[nextLevelNumber].name)
                    level.totalScore = gameScene.getScore()
                    
                    addGame(level, 'campaign')
                    scenes.start('game')
                }
            }: undefined
        )
        gameScene.setLevel(levelData)
        scenes.add('game', gameScene)
        gameScene.startGame()
    }
    
    let scenes = new ScenesNavigator(app)
    
    const refreshMainMenu = () => {
        scenes.remove('main-menu')
    
        const mainMenuScene = new MainMenuScene(async option => {
            switch(option) {
                case 0:
                    scenes.start('level-choice')
                break
                case 1:
                    refreshCampaignLevelsScene()
                    scenes.start('campaign-levels')
                break
                case 2:
                    refreshBonusLevelsScene()
                    scenes.start('bonus-levels')
                break
                case 3:
                    scenes.start('scoreboard')
                break
                case 4:
                    scenes.start('options-menu')
                break
            }
        })
    
        scenes.add('main-menu', mainMenuScene)
    }
    const refreshOptionsMenu = () => {
        scenes.remove('options-menu')
    
        const optionsMenuScene = new OptionsMenuScene((set: number) => {
            scenes.pop()
            scenes.sceneNames.forEach(name => scenes.remove(name))
            scenes = new ScenesNavigator(app)
            
            init(set).finally(() => scenes.start('main-menu'))
        }, () => { scenes.pop() })
    
        scenes.add('options-menu', optionsMenuScene)
    }
    
    const refreshLevelChoiceScene = () => {
        scenes.remove('level-choice')
    
        const levelChoiceScene = new LevelChoiceScene(
            async (difficulty: string, levelName: string) => {
                const level = await loadGameLevel(difficulty, levelName)
                
                await addGame(level)
                scenes.start('game')
            },
            () => { scenes.pop() }
        )
    
        scenes.add('level-choice', levelChoiceScene)
    }
    const refreshCampaignLevelsScene = () => {
        scenes.remove('campaign-levels')
    
        const campaignLevelsScene = new LevelsMenuScene(
            getLevelsList('campaign').map(levelData => levelData.name),
            async levelName => {
                await addGame(await loadGameLevel('campaign', levelName), 'campaign')
                scenes.start('game')
            },
            () => { scenes.pop() },
            savedGamesList('campaign').length > 0? () => {
                refreshCampaignSavedGamesScene()
                scenes.start('campaign-saved')
            }: undefined
        )
    
        scenes.add('campaign-levels', campaignLevelsScene)
    }
    const refreshBonusLevelsScene = () => {
        scenes.remove('bonus-levels')
    
        const bonusLevelsScene = new LevelsMenuScene(
            getLevelsList('bonus').map(levelData => levelData.name),
            async levelName => {
                await addGame(await loadGameLevel('bonus', levelName), 'bonus')
                scenes.start('game')
            },
            () => { scenes.pop() },
            savedGamesList('bonus').length > 0? () => {
                refreshBonusSavedGamesScene()
                scenes.start('bonus-saved')
            }: undefined
        )
    
        scenes.add('bonus-levels', bonusLevelsScene)
    }
    const refreshCampaignSavedGamesScene = () => {
        scenes.remove('campaign-saved')
    
        const savedCampaignGamesScene = new LevelsMenuScene(
            savedGamesList('campaign'),
            async gameName => {
                await addGame(getLevel(readGame('campaign', gameName)), 'campaign')
                scenes.start('game')
            },
            () => { scenes.pop() }
        )
    
        scenes.add('campaign-saved', savedCampaignGamesScene)
    }
    const refreshBonusSavedGamesScene = () => {
        scenes.remove('bonus-saved')
    
        const savedBonusGamesScene = new LevelsMenuScene(
            savedGamesList('bonus'),
            async gameName => {
                await addGame(getLevel(readGame('bonus', gameName)), 'bonus')
                scenes.start('game')
            },
            () => { scenes.pop() }
        )
    
        scenes.add('bonus-saved', savedBonusGamesScene)
    }
    
    const refreshScoreboard = () => {
        scenes.remove('scoreboard')
    
        const scoreboardScene = new LevelsMenuScene(
            readScoreboard('campaign').map(score => score.name + ' ' + score.score),
            undefined,
            () => { scenes.pop() }
        )
    
        scenes.add('scoreboard', scoreboardScene)
    }
    
    const init = async (assets: number) => {
        BitmapFont.from('buttonLabelFont', {
            fontFamily: 'Noto Sans',
            fill: 0xffffff,
            fontSize: 30
        })
        await loadAssets(assets)
    
        refreshMainMenu()
        refreshOptionsMenu()
    
        refreshLevelChoiceScene()
        refreshCampaignLevelsScene()
        refreshBonusLevelsScene()
    
        refreshCampaignSavedGamesScene()
        refreshBonusSavedGamesScene()
    
        refreshScoreboard()
    }
    
    init(1).finally(() => scenes.start('main-menu'))
}

const enterListener = (event: any) => {
    if(event.key == 'Enter') {
        event.preventDefault()

        hideNicknameInput()
        onNicknameConfirm((document.getElementById('name-input-field') as HTMLInputElement).value)
    }
}
window.addEventListener('keyup', enterListener)

document.getElementById('name-input-button')!.addEventListener('click', () => {
    hideNicknameInput()
    onNicknameConfirm((document.getElementById('name-input-field') as HTMLInputElement).value)
})

const hideNicknameInput = () => {
    (document.getElementById('name-input') as HTMLDivElement).style.display = 'none'
    ;(document.getElementById('pixi-canvas') as HTMLDivElement).style.display = 'block'

    window.removeEventListener('keyup', enterListener)
}