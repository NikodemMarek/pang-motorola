import { SceneManager } from 'pixi-scenes'
import { Application } from 'pixi.js'
import React from 'react'
import { GameState, RENDERER_SIZE } from '../const'
import { getLevel, loadLevel, rawLevel, saveGame } from '../levels-provider'
import { addToScoreboard } from '../scoreboard'
import { Level, LevelData } from '../types'
import { Button, ButtonProps } from './Button'
import GameScene from './game-scene'
import { Menu } from './Menu'
import { Stats, StatsProps } from './Stats'

interface GameComponentProps {
    onFinish: () => void,
    mode: string,
    levelName: string
}

interface GameComponentState {
    gameState: GameState,
    stats: StatsProps
}

export class GameComponent extends React.Component<GameComponentProps, GameComponentState> {
    pixiCtx: any
    app: Application
    scenes: SceneManager
    gameScene: GameScene | undefined
    won: boolean | undefined

    constructor(props: any) {
        super(props)

        this.state = {
            gameState: GameState.INIT,
            stats: {
                levelName: this.props.levelName,
                time: this.gameScene?.game.time || 0,
                score: this.gameScene?.game.score || 0,
                clockTimeLeft: this.gameScene?.game.clockTimeLeft || 0,
                hourglassTimeLeft: this.gameScene?.game.hourglassTimeLeft || 0,
                lives: this.gameScene?.game.players[0].lives || 0,
                gun: this.gameScene?.game.players[0].gun || 0,
                forceFields: this.gameScene?.game.players[0].forceFields || 0,
                forceFieldsTimeLeft: this.gameScene?.game.players[0].forceFieldsTimeLeft || 0
            }
        }

        this.changeGameState = this.changeGameState.bind(this)
        this.finish = this.finish.bind(this)

        this.saveScore = this.saveScore.bind(this)
        this.saveGameState = this.saveGameState.bind(this)

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

                <div className='side-menu'>
                    <Button
                        label={'Pause'}
                        onClick={() => this.changeGameState(GameState.PAUSED)}
                    />
                    <Stats
                        levelName={this.props.levelName}
                        time={this.state.stats.time || 0}
                        score={this.state.stats.score || 0}
                        clockTimeLeft={this.state.stats.clockTimeLeft || 0}
                        hourglassTimeLeft={this.gameScene?.game.hourglassTimeLeft || 0}
                        lives={this.state.stats.lives || 0}
                        gun={this.state.stats.gun || 0}
                        forceFields={this.state.stats.forceFields || 0}
                        forceFieldsTimeLeft={this.state.stats.forceFieldsTimeLeft || 0}
                    />
                </div>
            </div>

            {
                this.state.gameState == GameState.RUNNING
                ? null
                : <div className='game-overlay'>
                    {
                        [
                            <Menu
                                elements={[
                                    { label: 'Go!', onClick: () => this.changeGameState(GameState.RUNNING) },
                                    { label: 'Back', onClick: this.finish }
                                ]}
                            />,
                            <div></div>,
                            <Menu
                                elements={[
                                    { label: 'Continue', onClick: () => this.changeGameState(GameState.RUNNING) },
                                    { hint: 'Save Score', onSubmit: (nickname: string) => this.saveScore(nickname) },
                                    { hint: 'Save Game', onSubmit: (saveName: string) => this.saveGameState(saveName) },
                                    { label: 'Finish', onClick: () => this.changeGameState(GameState.FINISHED) }
                                ]}
                            />,
                            <div className='game-over'>
                                {
                                    this.won != undefined
                                    ? <span>{this.won? 'You Won!': 'You Lost'}<br /></span>
                                    : null
                                }
                                <span>{this.state.stats.score} Points</span>
                                <Menu
                                    elements={[
                                        { hint: 'Save Score', onSubmit: (nickname: string) => this.saveScore(nickname) },
                                        this.won? { label: 'Next Level', onClick: () => console.log('next level') }: null,
                                        { label: 'Finish', onClick: this.finish }
                                    ].filter(b => b != null) as Array<ButtonProps>}
                                />
                            </div>
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

            const rawLevel = await loadLevel(this.props.mode, this.props.levelName)
            const level = getLevel(rawLevel)

            this.gameScene = new GameScene(
                (won: boolean) => {
                    this.won = won
                    this.changeGameState(GameState.FINISHED)
                },
            )
            this.gameScene.setLevel(level)
            this.scenes.add('game', this.gameScene)
            this.scenes.start('game')
            
            this.changeGameState(this.state.gameState)
            this.app.ticker.add(() => {
                this.setState({
                    stats: {
                        levelName: this.props.levelName,
                        time: this.gameScene?.game.time || 0,
                        score: this.gameScene?.game.score || 0,
                        clockTimeLeft: this.gameScene?.game.clockTimeLeft || 0,
                        hourglassTimeLeft: this.gameScene?.game.hourglassTimeLeft || 0,
                        lives: this.gameScene?.game.players[0].lives || 0,
                        gun: this.gameScene?.game.players[0].gun || 0,
                        forceFields: this.gameScene?.game.players[0].forceFields || 0,
                        forceFieldsTimeLeft: this.gameScene?.game.players[0].forceFieldsTimeLeft || 0
                    }
                })
            })
        }
    }

    changeGameState = (gameState: GameState) => {
        this.setState({
            gameState: gameState
        })

        this.gameScene!.state = gameState
    }

    finish = () => {
        this.app.ticker.destroy()
        this.props.onFinish()
    }

    saveScore = (nickname: string) => {
        addToScoreboard(this.props.mode, nickname, this.gameScene!.getScore())
    }

    saveGameState = (saveName: string) => {
        saveGame(
            this.props.mode,
            saveName,
            rawLevel(
                {
                    level: {
                        players: this.gameScene?.game.players,
                        balls: this.gameScene?.game.balls,
                        bullets: this.gameScene?.game.bullets,
                        powerUps: this.gameScene?.game.powerUps,
                        points: this.gameScene?.game.points,
                        platforms: this.gameScene?.game.platforms,
                        ladders: this.gameScene?.game.ladders,
                        portals: this.gameScene?.game.portals
                    } as Level,
                    info: {
                        time: this.gameScene?.game.time,
                        score: this.gameScene?.game.score,
                        hourglassTimeLeft: this.gameScene?.game.hourglassTimeLeft,
                        clockTimeLeft: this.gameScene?.game.clockTimeLeft
                    },
                    name: this.props.levelName
                } as LevelData
            )
        )
    }
}