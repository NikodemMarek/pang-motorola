import { Scene } from 'pixi-scenes'
import { GameState } from '../const'
import BodiesDrawer from '../game/bodies-drawer'
import Game from '../game/game'
import { Level, LevelData } from '../types'

export default class GameScene extends Scene {
    /**
     * Klasa pozwalająca na wyświetlanie gry.
     */
    bodiesDrawer: BodiesDrawer
    state: GameState = GameState.INIT
    game: Game

    totalScore: number = 0
    
    finish: (won: boolean) => void
    save: ((game: Game) => void) | undefined

    constructor(
        onFinish: (won: boolean) => void,
        onSave?: (game: Game) => void
    ) {
        super()

        this.sortableChildren = true

        this.finish = (won: boolean) => {
            this.state = GameState.FINISHED
            onFinish(won)
        }

        this.save = onSave
    
        this.bodiesDrawer = new BodiesDrawer()
        this.game = new Game(won => this.finish(won))
    }

    setLevel(levelData: LevelData) {
        this.game.setLevel(levelData.level)
        this.bodiesDrawer.setLevel(this, levelData.level)

        this.game.time = levelData.info.time
        this.game.score = levelData.info.score
        this.game.clockTimeLeft = levelData.info.clockTimeLeft
        this.game.hourglassTimeLeft = levelData.info.hourglassTimeLeft

        this.totalScore = levelData.totalScore || 0
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