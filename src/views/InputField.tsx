import React from 'react'

/**
 * Właściwości pola tekstowego.
 */
export interface InputFieldProps {
    /**
     * Podpowiedź wyświetlająca się w polu, przed rozpoczęciem pisania.
     */
    hint: string,
    /**
     * Funkcja wykonująca się po kliknięciu przycisk potwierdzenia.
     */
    onSubmit: (value: string) => void
}
/**
 * Stan pola tekstowego.
 */
export interface InputFieldState {
    /**
     * Wartość w polu tekstowym.
     */
    value: string
}
/**
 * Pole tekstowe.
 */
export class InputField extends React.Component<InputFieldProps, InputFieldState> {
    /**
     * Nadaje polu tekstowemu właściwości i stan.
     * 
     * @param props - Właściwości pola tekstowego
     */
    constructor(props: InputFieldProps) {
        super(props)
        this.state = {
            value: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    /**
     * Wyświetla pole tekstowe.
     * 
     * @returns Pole tekstowe
     */
    override render = () => { 
        return <div className='input-field'>
            <input type='text' name='value' onChange={this.handleChange} placeholder={this.props.hint} autoComplete='off'/>
            <img src={'./images/confirm.png'} alt='submit' onClick={this.handleSubmit} />
        </div>
    }
    
    /**
     * Odświeża wartość w polu tekstowym.
     * 
     * @param event - Zarejestrowane wydarzenie
     */
    handleChange = (event: any) => {
        this.setState({
            value: event.target.value
        })
    }
    /**
     * Sprawdza czy pole nie jest puste.
     * Wykonuje funkcję po zaakceptowaniu.
     * 
     * @param event - Zarejestrowane wydarzenie
     */
    handleSubmit = (event: any) => {
        event.preventDefault()
        if(this.state.value.match('[A-Za-z0-9_]+')) this.props.onSubmit(this.state.value)
    }
}