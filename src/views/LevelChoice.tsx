import React from 'react'
import { getLevelsList, removeGame, savedGamesList } from '../levels-provider'
import { Menu } from './Menu'

/**
 * Właściwości wyboru poziomów.
 */
interface LevelChoiceProps {
    /**
     * Moduł rozgrywki z którego wybierane są poziomy.
     */
    mode: string,
    /**
     * Czy poziomy mają być wczytane z zapisanych gier.
     */
    saved: boolean,
    /**
     * Funkcja wykonująca się po wybraniu poziomu.
     */
    onLevelClick: (levelName: string) => void,
    /**
     * Funkcja wykonująca się na wyjściu.
     */
    onExit: () => void,
    /**
     * Funkcja wykonująca się po kliknięciu w przycisk z zapisanymi grami.
     */
    onSavedGamesClick?: () => void,
    /**
     * Funkcja wykonująca się po potwierdzeniu w polu tekstowym.
     */
    onSaveAs?: (name: string) => void
}
/**
 * Stan wyboru poziomów.
 */
interface LevelChoiceState {
    /**
     * Czy włączone jest usuwanie.
     */
    remove: boolean
}
/**
 * Wybór poziomów.
 */
export class LevelChoice extends React.Component<LevelChoiceProps, LevelChoiceState> {
    constructor(props: LevelChoiceProps) {
        super(props)
        this.state = {
            remove: false
        }
    }

    /**
     * Renderuje wybór poziomów.
     * Jeśli {@link saved} jest true, pokazuje zaisane poziomy z wybranego {@link mode | trybu rozgrywki}.
     * Jeśli {@link onSaveAs} jest zdefiniowane, wyświetla pole tekstowe pozwalające na wpisanie nazwy poziomu.
     * 
     * @returns Wybór poziomów
     */
    override render = () => {
        const levels = this.props.saved
        ? savedGamesList(this.props.mode)
        : getLevelsList(this.props.mode).map(level => level.name)

        return <div className='level-choice'>
            <div className='level-choice-menu'>
                <Menu
                    elements={levels.map(
                        level => {
                            return {
                                label: level,
                                onClick: () => {
                                    if(this.props.saved && this.state.remove) {
                                        removeGame(this.props.mode, level)
                                        this.setState({  })
                                    }
                                    else this.props.onLevelClick(level)
                                }
                            }
                        }
                    )}
                />
            </div>

            <Menu
                elements={[
                    this.props.saved? {
                        label: 'Remove',
                        onToggle: () => this.setState({ remove: !this.state.remove }),
                        toggled: this.state.remove
                    }: null,
                    this.props.mode.match('campaign|bonus') && this.props.onSaveAs != undefined? {
                        hint: 'Save Game',
                        onSubmit: (name: string) => this.props.onSaveAs!(name)
                    }: null,
                    !this.props.saved
                    && this.props.mode.match('campaign|bonus')
                    && this.props.onSavedGamesClick != undefined
                    && savedGamesList(this.props.mode).length > 0
                    ? {
                        label: 'Load Game',
                        onClick: this.props.onSavedGamesClick
                    }: null,
                    {
                        label: 'Back',
                        onClick: this.props.onExit
                    }
                ]}
            />
        </div>
    }
}