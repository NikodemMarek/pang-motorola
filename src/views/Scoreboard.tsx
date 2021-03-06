import React from 'react'
import { readScoreboard } from '../scoreboard'
import { Button } from './Button'
import { Menu } from './Menu'

/**
 * Właściwości tabeli wyników.
 */
export interface ScoreboardProps {
    /**
     * Tryb rozgrywki tabeli wyników.
     */
    mode: string,
    /**
     * Funkcja wykonująca się po kliknięciu przycisku wyjścia.
     */
    onExit: () => void
}
/**
 * Stan tabeli wyników.
 */
export interface ScoreboardState {
    /**
     * Obecnie wyświetlany wynik.
     */
    displayedScore: { name: string, score: number } | null
}
/**
 * Tabela wyników.
 */
export class Scoreboard extends React.Component<ScoreboardProps, ScoreboardState> {
    /**
     * Initializuje tabele wyników.
     * 
     * @param props - Właściwości tabeli wyników.
     */
    constructor(props: ScoreboardProps) {
        super(props)
        this.state = {
            displayedScore: readScoreboard(this.props.mode)[0] || null
        }

        this.displayScore = this.displayScore.bind(this)
    }

    /**
     * Renderuje tabelę wyników.
     * 
     * @returns Tabela wyników
     */
    override render = () => {
        const scores = readScoreboard(this.props.mode)

        return <div className='scoreboard'>
            <div className='scoreboard-hall-of-fame'>
                <Menu
                    elements={scores.map(
                        (score, i) => {
                            return {
                                label: `${i + 1}. ${score.name}`,
                                onClick: () => {
                                    this.displayScore(score)
                                }
                            }
                        }
                    )}
                />
            </div>

            <div className='scoreboard-score'>
                {
                    this.state.displayedScore != null
                    ? <div style={{height: '100px'}}>
                        <h1>{this.state.displayedScore.name}</h1>
                        <h3>{this.state.displayedScore.score} points</h3>
                    </div>
                    : null
                }
                <Button
                    label={'Back'}
                    onClick={this.props.onExit}
                />
            </div>
        </div>
    }

    /**
     * Zmienia wyswietlany wynik nad przyciskiem wyjścia.
     * 
     * @param score - Wynik do wyświetlenia
     */
    displayScore = (score: { name: string, score: number }) => {
        this.setState({
            displayedScore: score
        })
    }
}