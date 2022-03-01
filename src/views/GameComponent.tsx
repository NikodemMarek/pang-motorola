import { SceneManager } from 'pixi-scenes'
import { Application } from 'pixi.js'
import React from 'react'
import { RENDERER_SIZE } from '../const'
import { getLevel, getLevelsList, loadLevel } from '../levels-provider'
import GameScene from './game-scene'

export class GameComponent extends React.Component<any, any> {
    pixiCtx: any
    app: Application
    scenes: SceneManager

    constructor(props: any) {
        super(props)

        this.pixiCtx = null
        this.app = new Application({
            view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0xffffff,
            width: RENDERER_SIZE.x,
            height: RENDERER_SIZE.y
        })
        this.scenes = new SceneManager(this.app)
    }

    override render = () => { 
        return <div ref={this.updatePixiCtx}></div>
    }

    updatePixiCtx = async (element: any) => {
        this.pixiCtx = element

        if(this.pixiCtx && this.pixiCtx.children.length<=0) await this.initialize()
    }

    initialize = async () => {
        this.pixiCtx.appendChild(this.app.view)

        const rawLevel = await loadLevel('easy', getLevelsList('easy')[0].name)
        const level = getLevel(rawLevel)

        const gameScene = new GameScene(
            (won?: boolean) => {
                console.log(won)
            },
        )
        gameScene.setLevel(level)
        this.scenes.add('game', gameScene)
        this.scenes.start('game')
        gameScene.startGame()
    }
}