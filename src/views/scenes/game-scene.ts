import { Scene } from 'pixi-scenes'
import { ImagesProvider } from '../../assets-provider'
import { Colors, GameState, GAME_SIZE, ImagePath, RENDERER_SIZE, ZIndex } from '../../const'
import BodiesDrawer from '../../game/bodies-drawer'
import Game from '../../game/game'
import { Level } from '../../types'
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

    finish: () => void

    constructor(onFinish: () => void) {
        super()

        this.sortableChildren = true

        this.finish = () => {
            this.state = GameState.FINISHED
            onFinish()
        }
    
        this.bodiesDrawer = new BodiesDrawer()
        this.game = new Game(this.finish)

        this.sideMenu = new SideMenu(
            '',
            {
                lives: 0,
                clockTimeLeft: 0,
                hourglassTimeLeft: 0,
                gun: 0,
                forceFields: 0,
                forceFieldTimeLeft: 0,
            },
            this.pause
        )
        this.sideMenu.position.set(GAME_SIZE.x, 0)
        this.addChild(this.sideMenu)
    }

    setLevel(level: Level, levelInfo: any, levelName: string) {
        this.game.setLevel(level)
        this.bodiesDrawer.setLevel(this, level)

        this.game.time = levelInfo.time
        this.game.score = levelInfo.score
        this.game.clockTimeLeft = levelInfo.clockTimeLeft
        this.game.hourglassTimeLeft = levelInfo.hourglassTimeLeft
        this.sideMenu.levelName.text = levelName
    }

    /**
     * Zatrzymuje grę i wyświetla menu pauzy.
     */
    pause = () => {
        if(this.state != GameState.PAUSED) {
            this.state = GameState.PAUSED
    
            const pauseMenu = new Menu(
                [
                    {
                        onClick: () => this.state = GameState.RUNNING,
                        properties: {
                            label: 'Continue',
                        }
                    },
                    {
                        onClick: this.finish,
                        properties: {
                            label: 'Exit',
                        }
                    }
                ],
                {
                    size: { x: 200, y: 50 },
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
                points: this.game.score,
                clockTimeLeft: this.game.clockTimeLeft,
                hourglassTimeLeft: this.game.hourglassTimeLeft,
                lives: this.game.players[0].lives,
                gun: this.game.players[0].gun,
                forceFields: this.game.players[0].forceFields,
                forceFieldTimeLeft: this.game.players[0].forceFieldsTimeLeft,
            }
        )
    }

    /**
     * Rozpoczyna grę.
     */
    override start(): void {
        this.state = GameState.RUNNING
    }

    /**
     * Zakańcza grę.
     */
    override stop(): void {
        this.state = GameState.FINISHED
    }

    override update(delta: number): void {
        if(this.state == GameState.RUNNING) {
            this.game.update(delta / 1000)
            this.draw()
        }
    }
}