import React from 'react'

export interface InputFieldProps {
    hint: string,
    onSubmit: (value: string) => void
}

interface InputFieldState {
    value: string
}

export class InputField extends React.Component<InputFieldProps, InputFieldState> {
    constructor(props: any) {
        super(props)
        this.state = {
            value: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    override render = () => { 
        return <div className='input-field'>
            <input type='text' name='value' onChange={this.handleChange} placeholder={this.props.hint} autoComplete='off'/>
            <img src={'./images/confirm.png'} alt='submit' onClick={this.handleSubmit} />
        </div>
    }
    
    handleChange(event: any) {
        this.setState({
            value: event.target.value
        })
    }
  
    handleSubmit(event: any) {
        event.preventDefault()
        if(this.state.value.match('[A-Za-z0-9_]+')) this.props.onSubmit(this.state.value)
    }
}