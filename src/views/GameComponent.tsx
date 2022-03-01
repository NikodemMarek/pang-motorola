import { SceneManager } from 'pixi-scenes'
import { Application } from 'pixi.js'
import React from 'react'
import { GameState, RENDERER_SIZE } from '../const'
import { getLevel, getLevelsList, loadLevel } from '../levels-provider'
import { Button } from './Button'
import GameScene from './game-scene'
import { Menu } from './Menu'

interface GameComponentState {
    gameState: GameState
}

export class GameComponent extends React.Component<any, GameComponentState> {
    pixiCtx: any
    app: Application
    scenes: SceneManager
    gameScene: GameScene | undefined

    constructor(props: any) {
        super(props)

        this.state = {
            gameState: GameState.INIT
        }

        this.changeGameState = this.changeGameState.bind(this)

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
        return <div className='game'>
            <div className='game-running'>
                <div className='pixi-container' ref={this.updatePixiCtx}></div>
                <Button
                    label={'Pause'}
                    onClick={() => this.changeGameState(GameState.PAUSED)}
                />
            </div>

            {
                this.state.gameState == GameState.RUNNING
                ? null
                : <div className='game-overlay'>
                    {
                        [
                            <Button
                                label={'Go!'}
                                onClick={() => this.changeGameState(GameState.RUNNING)}
                            />,
                            <div></div>,
                            <Menu
                                buttons={[
                                    { label: 'Continue', onClick: () => this.changeGameState(GameState.RUNNING) }
                                ]}
                            />
                        ][this.state.gameState]
                    }
                </div>
            }
        </div>
    }

    updatePixiCtx = async (element: any) => {
        this.pixiCtx = element

        if(this.pixiCtx && this.pixiCtx.children.length <= 0) {
            this.pixiCtx.appendChild(this.app.view)

            const rawLevel = await loadLevel('easy', getLevelsList('easy')[0].name)
            const level = getLevel(rawLevel)

            this.gameScene = new GameScene(
                (won?: boolean) => {
                    console.log(won)
                },
            )
            this.gameScene.setLevel(level)
            this.scenes.add('game', this.gameScene)
            this.scenes.start('game')
            
            this.changeGameState(this.state.gameState)
        }
    }

    changeGameState = (gameState: GameState) => {
        this.setState({
            gameState: gameState
        })

        this.gameScene!.state = gameState
    }
}