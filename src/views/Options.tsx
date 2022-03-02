import React from 'react'
import { getImagesSetsList } from '../assets-provider'
import { Button } from './Button'
import { Menu } from './Menu'

interface OptionsProps {
    onExit: () => void,
    onLoad: (set: number) => void,
    loadedSet: number
}
 
interface OptionsState {
    
}
 
export class Options extends React.Component<OptionsProps, OptionsState> {
    override render = () => { 
        return <div className='options'>
            <Menu
                elements={
                    getImagesSetsList().map((set, i) => {
                        return i == this.props.loadedSet
                        ? {
                            label: set.name,
                            onToggle: () => {  },
                            toggled: true
                        }
                        : {
                            label: set.name,
                            onClick: () => this.props.onLoad(i)
                        }
                    })
                }
            />
            <Button
                label={'Back'}
                onClick={this.props.onExit}
            />
        </div>
    }
}