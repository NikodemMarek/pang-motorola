import React from 'react'
import { Guns } from '../const'

export interface StatsProps {
    levelName: string,
    time: number,
    score: number,
    clockTimeLeft: number,
    hourglassTimeLeft: number,
    lives: number,
    gun: Guns,
    forceFields: number,
    forceFieldsTimeLeft: number
}

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