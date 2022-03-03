import { Scene, SceneManager } from 'pixi-scenes'
import { Application } from 'pixi.js'
import React from 'react'
import { GameState, RENDERER_SIZE } from '../const'
import { getLevel, loadLevel, rawLevel, readGame, saveGame } from '../levels-provider'
import { addToScoreboard } from '../scoreboard'
import { Level, LevelData } from '../types'
import { Button, ButtonProps } from './Button'
import GameScene from './game-scene'
import { LevelChoice } from './LevelChoice'
import { Menu } from './Menu'
import { Stats, StatsProps } from './Stats'

/**
 * Właściwości komponentu z grą.
 */
interface GameComponentProps {
    /**
     * Funkcja wykonująca się na wyjściu.
     */
    onFinish: () => void,
    /**
     * Tryb rozgrywki.
     */
    mode: string,
    /**
     * Id wybranego poziomu, podanego przy stworzeniu komponentu gry.
     */
    levelId: string
}
/**
 * Właściwości komponentu z grą.
 */
interface GameComponentState {
    /**
     * Stan gry.
     */
    gameState: GameState,
    /**
     * Statystyki rozgrywki.
     */
    stats: StatsProps,
    /**
     * Nazwa rozgrywanego poziomu.
     */
    levelName: string,
    /**
     * Id rozgrywanego poziomu.
     */
    currentLevelId: string,
    /**
     * Czy wynik został zapisany.
     * Uniemożliwia wielokrotne zapisanie wyniku dla jednej rozgrywki.
     */
    scoreSaved: boolean
}
/**
 * Komponent z grą.
 */
export class GameComponent extends React.Component<GameComponentProps, GameComponentState> {
    /**
     * Element w którym będzie renderowana gra.
     */
    pixiCtx: any
    /**
     * Aplikacja Pixi.js.
     */
    app: Application
    /**
     * Menadżer scen Pixi.ja.
     */
    scenes: SceneManager
    /**
     * Scena Pixi.js z grą.
     */
    gameScene: GameScene | undefined

    /**
     * Czy poziom został wygrany.
     */
    won: boolean | undefined
    /**
     * Całkowity wynik zebrany podczas wszystkich rozegranych rozgrywek.
     */
    totalScore: number = 0
    /**
     * Czy rozgrywana jest pierwsza rozgrywka.
     * Jeśli pierwszy poziom był wczytywany z zapisanych gier, informuje że następny ma być wczytany z zestawu przygotowanych poziomów.
     */
    firstGame: boolean = true

    /**
     * Initializuje komponent z grą.
     * Tworzy aplikację Pixi.js i dodaje menadżer scen.
     * 
     * @param props - Właściwości komponentu z grą
     */
    constructor(props: GameComponentProps) {
        super(props)
        this.state = {
            gameState: GameState.INIT,
            stats: {
                levelName: this.props.levelId,
                time: this.gameScene?.game.time || 0,
                score: this.gameScene?.game.score || 0,
                clockTimeLeft: this.gameScene?.game.clockTimeLeft || 0,
                hourglassTimeLeft: this.gameScene?.game.hourglassTimeLeft || 0,
                lives: this.gameScene?.game.players[0].lives || 0,
                gun: this.gameScene?.game.players[0].gun || 0,
                forceFields: this.gameScene?.game.players[0].forceFields || 0,
                forceFieldsTimeLeft: this.gameScene?.game.players[0].forceFieldsTimeLeft || 0
            },
            levelName: this.props.levelId,
            currentLevelId: this.props.levelId,
            scoreSaved: false
        }

        this.changeGameState = this.changeGameState.bind(this)
        this.finish = this.finish.bind(this)

        this.saveScore = this.saveScore.bind(this)
        this.saveGameState = this.saveGameState.bind(this)

        this.nextLevel = this.nextLevel.bind(this)

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

    /**
     * Renderuje komponent z grą.
     * {@link updatePixiCtx | Wyświetla} grę.
     * 
     * @returns Komponent z grą
     */
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
                        levelName={this.state.levelName}
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
                                    this.props.mode != 'choice'? { label: 'Save Game', onClick: () => this.changeGameState(GameState.SAVING_GAME) }: null,
                                    { label: 'Finish', onClick: () => this.changeGameState(GameState.FINISHED) }
                                ]}
                            />,
                            <LevelChoice
                                mode={this.props.mode.startsWith('saved')? this.props.mode.slice(6, this.props.mode.length): this.props.mode}
                                saved={true}
                                onLevelClick={() => {  }}
                                onExit={() => this.changeGameState(GameState.PAUSED)}
                                onSaveAs={(name: string) => this.saveGameState(name)}
                            />,
                            <div className='game-over'>
                                {
                                    this.won != undefined
                                    ? <span>{this.won? 'You Won!': 'You Lost'}<br /></span>
                                    : null
                                }
                                <span>{this.totalScore} Points</span>
                                <Menu
                                    elements={[
                                        this.props.mode.endsWith('campaign') && !this.state.scoreSaved? { hint: 'Save Score', onSubmit: (nickname: string) => this.saveScore(nickname) }: null,
                                        this.won && this.props.mode.endsWith('campaign') && Number(this.state.currentLevelId) < 15? { label: 'Next Level', onClick: () => this.nextLevel(Number(this.state.currentLevelId) + 1) }: null,
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

    /**
     * Po wyrenderowaniu komponentów przez React, wyświetla grę.
     * 
     * @param element - Element w którym ma być wyświetlona gra
     */
    updatePixiCtx = async (element: any) => {
        this.pixiCtx = element

        if(this.pixiCtx && this.pixiCtx.children.length <= 0) {
            this.pixiCtx.appendChild(this.app.view)

            this.scenes.add('init', new Scene())

            await this.refresh(this.state.currentLevelId)

            this.app.ticker.add(() => {
                this.setState({
                    stats: {
                        levelName: this.state.levelName,
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

    /**
     * Odświeża grę.
     * Wczytuje poziom z podanym Id.
     * Usuwa scenę Pixi.js z grą i dodaje na jej miejsce nową.
     * 
     * @param levelId - Id poziomu do wczytania
     */
    refresh = async (levelId: string) => {
        const rawLevel = this.props.mode.startsWith('saved') && this.firstGame
            ? readGame(this.props.mode.split('-')[1], levelId)
            : await loadLevel(this.props.mode.replace('saved-', ''), levelId)

            const level = getLevel(rawLevel)

            this.scenes.remove('game')
            this.gameScene = new GameScene(
                (won: boolean) => {
                    this.won = won
                    this.changeGameState(GameState.FINISHED)
                },
            )
            this.gameScene.setLevel(level)
            this.scenes.add('game', this.gameScene)
            this.scenes.start('game')

            this.changeGameState(GameState.INIT)
            this.setState({
                currentLevelId: this.props.mode == 'saved-campaign' && this.firstGame? `${Number(level.name.slice(0, 2))}`: this.state.currentLevelId,
                levelName: this.props.mode == 'saved-campaign' && this.firstGame? level.name.slice(2, level.name.length): level.name
            })
    }

    /**
     * Zmienia stan gry.
     * 
     * @param gameState - Nowy stan gry
     */
    changeGameState = (gameState: GameState) => {
        if(gameState == GameState.FINISHED) this.totalScore += this.gameScene!.getScore()

        this.setState({
            gameState: gameState
        })

        this.gameScene!.state = gameState
    }

    /**
     * Zakańcza funkcję odświeżającą grę i grę.
     * Wykonuje funkcję {@link onFinish}.
     */
    finish = () => {
        this.app.ticker.destroy()
        this.props.onFinish()
    }

    /**
     * Zapisuje wynik rozgrywki do tabeli wyników.
     * 
     * @param nickname - Nickname gracza pod którym zostanie zapisany wynik
     */
    saveScore = (nickname: string) => {
        addToScoreboard(this.props.mode, nickname, this.totalScore)
        this.setState({
            scoreSaved: true
        })
    }

    /**
     * Zapisuje stan rozgrywki.
     * 
     * @param saveName - Nazwa pod którą zostanie zapisana rozgrywka
     */
    saveGameState = (saveName: string) => {
        saveGame(
            this.props.mode.startsWith('saved')? this.props.mode.slice(6, this.props.mode.length): this.props.mode,
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
                    name: this.props.mode.endsWith('campaign')? this.state.currentLevelId.padStart(2, '00') + this.state.levelName: this.state.levelName
                } as LevelData
            )
        )
    }

    /**
     * {@link refresh | Wczytuje i wyświetla} następny poziom.
     * 
     * @param nextLevelId - Id następnego poziomu do wczytania
     */
    nextLevel = async (nextLevelId: number) => {
        this.firstGame = false
        this.setState({
            currentLevelId: `${nextLevelId}`,
            scoreSaved: false
        })
        await this.refresh(`${nextLevelId}`)
    }
}