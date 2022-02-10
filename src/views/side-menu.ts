import { BitmapText, Container } from 'pixi.js'
import { ImagesProvider } from '../assets-provider'
import { GAME_SIZE, ImagePath, RENDERER_SIZE } from '../const'
import { LevelInfo } from '../types'
import Button from './button'

export default class SideMenu extends Container {
    levelName: string
    infoContainer: Container
    
    constructor(
        levelName: string,
        info: LevelInfo,
        pause: () => void
    ) {
        super()

        this.levelName = levelName

        window.addEventListener('keydown', event => { if(event.key == 'Escape') pause() })
        const pauseButton = new Button(
            pause,
            {
                size: { x: 200, y: 50 },
                label: 'Pause',
                labelColor: 0x00ff00,
                labelHoverColor: 0xff00ff,
                texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER)
            }
        )
        pauseButton.position.set(100, 25)
        this.addChild(pauseButton)

        const name = new BitmapText(levelName, { fontName: 'buttonLabelFont', tint: 0x00ff00, maxWidth: RENDERER_SIZE.x - GAME_SIZE.x })
        name.anchor.set(0.5)
        name.position.set(100, 100)
        this.addChild(name)

        this.infoContainer = new Container()
        this.infoContainer.pivot.set(100, 0)
        this.infoContainer.position.set(110, 160)

        ;([
            new BitmapText(`${(Math.floor(info.time || 0)).toString()}s`, { fontName: 'buttonLabelFont', tint: 0x00ff00 }),
            new BitmapText(`${(info.points || 0).toString()} ${info.points == 1? 'point': 'points'}`, { fontName: 'buttonLabelFont', tint: 0x00ff00 }),
            new BitmapText(`${(((info.lives || 0) > 0? info.lives: 0) || 0).toString()} ${info.lives == 1? 'live': 'lives'}`, { fontName: 'buttonLabelFont', tint: 0x00ff00 }),
            new BitmapText([ 'Harpoon', 'Double Harpoon', 'Power Wire', 'Vulcan Missile' ][info.gun || 0], { fontName: 'buttonLabelFont', tint: 0x00ff00 }),
            new BitmapText(`${Math.ceil(info.clockTimeLeft || 0)?.toString()}s Clock`, { fontName: 'buttonLabelFont', tint: 0x00ff00 }),
            new BitmapText(`${Math.ceil(info.hourglassTimeLeft || 0)?.toString()}s Hourglass`, { fontName: 'buttonLabelFont', tint: 0x00ff00 }),
            new BitmapText(`${Math.ceil(info.forceFieldTimeLeft || 0)?.toString()}s ${info.forceFields || 0} Shield`, { fontName: 'buttonLabelFont', tint: 0x00ff00 }),
        ] as Array<BitmapText>).forEach((text, i) => {
            text.position.set(0, i * 40 + (i > 3? 20: 0))
            this.infoContainer.addChild(text)
        })
        this.addChild(this.infoContainer)

        this.updateInfo(info)
    }

    updateInfo(info: LevelInfo) {
        const newInfo = [
            `${(Math.floor(info.time || 0)).toString()}s`,
            `${(info.points || 0).toString()} ${info.points == 1? 'point': 'points'}`,
            `${(((info.lives || 0) > 0? info.lives: 0) || 0).toString()} ${info.lives == 1? 'live': 'lives'}`,
            [ 'Harpoon', 'Double Harpoon', 'Power Wire', 'Vulcan Missile' ][info.gun || 0],
            ... ([
                `${Math.ceil(info.clockTimeLeft || 0)?.toString()}s Clock`,
                `${Math.ceil(info.hourglassTimeLeft || 0)?.toString()}s Hourglass`,
                `${Math.ceil(info.forceFieldTimeLeft || 0)?.toString()}s ${info.forceFields || 0} Shield`
            ] as Array<string>).filter(text => text[0] != '0')
        ]

        this.infoContainer.children.forEach((child, i) => (child as BitmapText).text = newInfo[i])
    }
}