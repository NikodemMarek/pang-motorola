import { Container } from 'pixi.js'

export default class Game {
    container: Container
    state: number = Game.states.INIT
    private update: (delta: number) => void

    public static states = {
        INIT: 0,
        RUNNING: 1,
        PAUSED: 1,
        FINISHED: 2
    }

    constructor(
        container: Container,
        update: (delta: number) => void
    ) {
        this.container = container
        this.update = update
    }

    start(FPS: number = 30) {
        const frameTime = 1000 / FPS

        this.state = Game.states.RUNNING
        setInterval(() => { if(this.state == Game.states.RUNNING) this.update(frameTime / 1000) }, frameTime)
    }
}