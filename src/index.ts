import { clearTextureCache } from '@pixi/utils'
import { Application, BitmapFont, Loader } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { RENDERER_SIZE } from './const'
import { getLevel, getLevelsList, loadLevel, rawLevel, readGame, removeGame, savedGamesList, saveGame } from './levels-provider'
import { addToScoreboard, readScoreboard } from './scoreboard'
import { Level, LevelData } from './types'
import GameOverScene from './views/scenes/game-over-scene'
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
    
    const addGame = async (levelData: LevelData, mode: string) => {
        scenes.remove('game')
        
        const gameScene = new GameScene(
            (won?: boolean) => {    
                if(mode == 'campaign') {
                    addToScoreboard('campaign', nickname, gameScene.getScore())
                    refreshScoreboard()
                }

                scenes.remove('game-over')
                const gameOverScene = new GameOverScene(
                    () => { scenes.pop() },
                    gameScene.getScore(),
                    won,
                    mode == 'campaign' && parseInt(levelData.name.slice(0, 2)) < getLevelsList('campaign').length? async () => {
                        const nextLevelNumber = parseInt(levelData.name.slice(0, 2))

                        const level = await loadGameLevel('campaign', getLevelsList('campaign')[nextLevelNumber].name)
                        level.totalScore = gameScene.getScore()
                        
                        addGame(level, 'campaign')
                        scenes.start('game')
                    }: undefined,
                    mode == 'campaign'? () => {
                        addToScoreboard('campaign', nickname, gameScene.getScore())
                        refreshScoreboard()
                    }: undefined
                )
                scenes.pop()
                scenes.add('game-over', gameOverScene)
                scenes.start('game-over')
            },
            mode == 'campaign' || mode == 'bonus'? game => {
                scenes.remove('save-game')

                const savedGames = savedGamesList(mode)
                const saveGamesScene = new LevelsMenuScene(
                    Array(9).fill('').map((_, i) => savedGames[i] || 'empty'),
                    async saveName => {
                        removeGame(mode, saveName)
                        saveGame(mode, nickname, rawLevel({
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
                
                await addGame(level, difficulty)
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
    event.preventDefault()

    const nickname = (document.getElementById('name-input-field') as HTMLInputElement).value
    if(event.key == 'Enter' && nickname != '') {
        hideNicknameInput()
        onNicknameConfirm(nickname)
    }
}
window.addEventListener('keyup', enterListener)

document.getElementById('name-input-button')!.addEventListener('click', () => {
    const nickname = (document.getElementById('name-input-field') as HTMLInputElement).value
    if(nickname != '') {
        hideNicknameInput()
        onNicknameConfirm(nickname)
    }
})

const hideNicknameInput = () => {
    (document.getElementById('name-input') as HTMLDivElement).style.display = 'none'
    ;(document.getElementById('pixi-canvas') as HTMLDivElement).style.display = 'block'

    window.removeEventListener('keyup', enterListener)
}