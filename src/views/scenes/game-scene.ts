import { Scene } from 'pixi-scenes'
import { ImagesProvider } from '../../assets-provider'
import { Colors, GameState, GAME_SIZE, ImagePath, RENDERER_SIZE, ZIndex } from '../../const'
import BodiesDrawer from '../../game/bodies-drawer'
import Game from '../../game/game'
import { ButtonProperties, Level, LevelData } from '../../types'
import Menu from '../menu'
import SideMenu from '../side-menu'

export default class GameScene extends Scene {
    /**
     * Klasa pozwalająca na wyświetlanie gry.
     */
    bodiesDrawer: BodiesDrawer
    /**
     * Menu z informacjami na temat rozgrywki.
     */
    sideMenu: SideMenu
    state: GameState = GameState.INIT
    game: Game

    totalScore: number = 0
    
    finish: (won?: boolean) => void
    save: ((game: Game) => void) | undefined

    constructor(
        onFinish: (won?: boolean) => void,
        onSave?: (game: Game) => void
    ) {
        super()

        this.sortableChildren = true

        this.finish = (won?: boolean) => {
            this.state = GameState.FINISHED
            onFinish(won)
        }

        this.save = onSave
    
        this.bodiesDrawer = new BodiesDrawer()
        this.game = new Game(won => this.finish(won))

        this.sideMenu = new SideMenu(
            '',
            {
                score: 0,
                time: 0,
                clockTimeLeft: 0,
                hourglassTimeLeft: 0
            },
            0, 0, 0, 0,
            this.pause
        )
        this.sideMenu.position.set(GAME_SIZE.x, 0)
        this.addChild(this.sideMenu)
    }

    setLevel(levelData: LevelData) {
        this.game.setLevel(levelData.level)
        this.bodiesDrawer.setLevel(this, levelData.level)

        this.game.time = levelData.info.time
        this.game.score = levelData.info.score
        this.game.clockTimeLeft = levelData.info.clockTimeLeft
        this.game.hourglassTimeLeft = levelData.info.hourglassTimeLeft
        this.sideMenu.levelName.text = levelData.name

        this.totalScore = levelData.totalScore || 0
    }

    /**
     * Zatrzymuje grę i wyświetla menu pauzy.
     */
    pause = () => {
        if(this.state != GameState.PAUSED) {
            this.state = GameState.PAUSED
    
            const options: Array<{
            onClick: (() => void) | undefined,
            properties: ButtonProperties,
            hideMenuOnClick?: boolean
        }> = [
                {
                    onClick: () => { this.state = GameState.RUNNING },
                    properties: {
                        label: 'Continue',
                    },
                    hideMenuOnClick: true
                },
                this.save != undefined? {
                    onClick: () => { this.save!(this.game) },
                    properties: {
                        label: 'Save',
                    },
                    hideMenuOnClick: false
                }: undefined,
                {
                    onClick: () => this.finish(undefined),
                    properties: {
                        label: 'Finish'
                    }
                }
            ].filter(option => option != undefined) as Array<{
                onClick: (() => void) | undefined,
                properties: ButtonProperties,
                hideMenuOnClick?: boolean
            }>

            const pauseMenu = new Menu(
                options,
                {
                    size: { x: 300, y: 50 },
                    texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                    hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                    labelColor: Colors.MENU_BUTTON,
                    labelHoverColor: Colors.MENU_BUTTON_HOVER
                }
            )
            pauseMenu.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
            pauseMenu.zIndex = ZIndex.PAUSE_MENU
            this.addChild(pauseMenu)
        }
    }

    getScore() { return this.totalScore + this.game.score - Math.floor(this.game.time) }

    /**
     * Wyświetla grę i statystyki.
     */
    draw() {
        this.bodiesDrawer.update(
            this,
            {
                players: this.game.players,
                balls: this.game.balls,
                bullets: this.game.bullets,
                powerUps: this.game.powerUps,
                points: this.game.points,
                platforms: this.game.platforms,
                ladders: this.game.ladders
            } as Level
        )
        
        this.sideMenu.updateInfo(
            {
                time: this.game.time,
                score: this.game.score,
                clockTimeLeft: this.game.clockTimeLeft,
                hourglassTimeLeft: this.game.hourglassTimeLeft
            },
            this.game.players[0].lives,
            this.game.players[0].gun,
            this.game.players[0].forceFields,
            this.game.players[0].forceFieldsTimeLeft,
        )
    }

    /**
     * Rozpoczyna grę.
     */
    startGame() { this.state = GameState.RUNNING }

    /**
     * Zakańcza grę.
     */
    override stop(): void {
        this.state = GameState.FINISHED
    }

    override update(delta: number): void {
        this.game.state = GameState.RUNNING

        if(this.state == GameState.RUNNING && this.game.state == GameState.RUNNING) {
            this.game.update(delta / 1000)
            this.draw()
        }
    }
}