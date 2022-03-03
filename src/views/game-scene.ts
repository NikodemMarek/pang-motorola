import { Scene } from 'pixi-scenes'
import { GameState } from '../const'
import BodiesDrawer from '../game/bodies-drawer'
import Game from '../game/game'
import { Level, LevelData } from '../types'

/**
 * Scena zawierająca grę.
 */
export default class GameScene extends Scene {
    /**
     * Klasa pozwalająca na wyświetlanie gry.
     */
    bodiesDrawer: BodiesDrawer
    /**
     * Stan gry.
     */
    state: GameState = GameState.INIT
    /**
     * Gra.
     */
    game: Game

    /**
     * Sumaryczny wynik zebrany w grze.
     */
    totalScore: number = 0

    /**
     * Funkja która wykona sie w przypadku przegranej lub wygranej.
     */
    finish: (won: boolean) => void

    /**
     * Initializuje obiekty odświeżające i rysujące grę.
     * Dodaje funckcję wykonującą się po zakończeniu gry.
     *
     * @param onFinish - Funkja wykonująca się po zakończeniu gry
     */
    constructor(
        onFinish: (won: boolean) => void
    ) {
        super()

        this.sortableChildren = true

        this.finish = (won: boolean) => {
            this.state = GameState.FINISHED
            onFinish(won)
        }

        this.bodiesDrawer = new BodiesDrawer()
        this.game = new Game(won => this.finish(won))
    }

    /**
     * Dodaje poziom do gry.
     *
     * @param levelData - Informacje o poziomie
     */
    setLevel = (levelData: LevelData) => {
        this.game.setLevel(levelData.level)
        this.bodiesDrawer.setLevel(this, levelData.level)

        this.game.time = levelData.info.time
        this.game.score = levelData.info.score
        this.game.clockTimeLeft = levelData.info.clockTimeLeft
        this.game.hourglassTimeLeft = levelData.info.hourglassTimeLeft

        this.totalScore = levelData.totalScore || 0
    }

    /**
     * Kalkuluje i zwraca wynik zebrany w grze i podany do niej.
     *
     * @returns Wynik
     */
    getScore = () => this.totalScore + this.game.score - Math.floor(this.game.time)

    /**
     * Wyświetla grę.
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
    startGame = () => this.state = GameState.RUNNING

    /**
     * Zakańcza grę.
     */
    override stop = () => this.state = GameState.FINISHED

    /**
     * Odświeża obiekty w grze.
     * 
     * @param delta - Czas od ostatniego odświeżenia
     */
    override update = (delta: number): void => {
        this.game.state = GameState.RUNNING

        if(this.state == GameState.RUNNING && this.game.state == GameState.RUNNING) {
            this.game.update(delta / 1000)
            this.draw()
        }
    }
}