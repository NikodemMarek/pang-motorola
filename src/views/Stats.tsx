import React from 'react'
import { Guns } from '../const'

/**
 * Status rozgrywki.
 */
export interface StatsProps {
    /**
     * Nazwa poziomu.
     */
    levelName: string,
    /**
     * Czas trwania rozgrywki.
     */
    time: number,
    /**
     * Wynik uzyskany podczas rozgrywki.
     */
    score: number,
    /**
     * Czas który pozostał do zakończenia się bonusu zatrzymania czasu.
     */
    clockTimeLeft: number,
    /**
     * Czas który pozostał do zakończenia się bonusu spowolnienia czasu.
     */
    hourglassTimeLeft: number,
    /**
     * Ilość żyć które pozostały postaci.
     */
    lives: number,
    /**
     * Aktywna broń.
     */
    gun: Guns,
    /**
     * Ilość tarczy ochronnych które podniósł gracz.
     */
    forceFields: number,
    /**
     * Czas który pozostał do zniknięcia tarczy ochronnej.
     */
    forceFieldsTimeLeft: number
}
/**
 * Komponent ze statusem rozgrywki.
 * 
 * @param props - Status rozgrywki
 * @returns Komponent ze statusem rozgrywki
 */
export const Stats = (props: StatsProps) => {
    return <p className='stats'>
        <span style={{fontSize: '30px'}}>{props.levelName}</span>
        <br /><br />

        Lives: {props.lives > 0? props.lives: 0}<br />
        Gun: {[ 'Harpoon', 'Double Harpoon', 'Power Wire', 'Vulcan Missile' ][props.gun]}<br />
        Score: {props.score}<br />
        Time: {Math.floor(props.time)}s<br />

        <br />

        {
            props.forceFields > 0 && props.forceFieldsTimeLeft > 0
            ? <span>Shields: {props.forceFields} for {Math.ceil(props.forceFieldsTimeLeft)}s<br /></span>
            : null
        }
        {
            props.clockTimeLeft > 0
            ? <span>Clock: {Math.ceil(props.clockTimeLeft)}s<br /></span>
            : null
        }
        {
            props.hourglassTimeLeft > 0
            ? <span>Hourglass: {Math.ceil(props.hourglassTimeLeft)}s<br /></span>
            : null
        }
    </p>
}