import React from 'react'
import { getLevelsList, removeGame, savedGamesList } from '../levels-provider'
import { Menu } from './Menu'

interface LevelChoiceProps {
    mode: string,
    saved: boolean,
    onLevelClick: (levelName: string) => void,
    onExit: () => void,
    onSavedGamesClick?: () => void,
    onSaveAs?: (name: string) => void
}

interface LevelChoiceState {
    remove: boolean
}

export class LevelChoice extends React.Component<LevelChoiceProps, LevelChoiceState> {
    constructor(props: LevelChoiceProps) {
        super(props)
        this.state = {
            remove: false
        }
    }

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
                                    if(this.props.saved && this.state.remove) removeGame(this.props.mode, level)
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
                        label: 'Delete',
                        onToggle: () => this.setState({remove: !this.state.remove}),
                        toggled: this.state.remove
                    }: null,
                    this.props.mode.match('campaign|bonus') && this.props.onSaveAs != undefined? {
                        hint: 'Save Game',
                        onSubmit: (name: string) => this.props.onSaveAs!(name)
                    }: null,
                    !this.props.saved && this.props.mode.match('campaign|bonus') && this.props.onSavedGamesClick != undefined? {
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