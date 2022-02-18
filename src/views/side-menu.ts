import { BitmapText, Container } from 'pixi.js'
import { ImagesProvider } from '../assets-provider'
import { Colors, GAME_SIZE, Guns, ImagePath, RENDERER_SIZE } from '../const'
import { LevelInfo } from '../types'
import Button from './button'

export default class SideMenu extends Container {
    levelName: BitmapText
    infoContainer: Container
    
    constructor(
        levelName: string,
        info: LevelInfo,
        lives: number,
        gun: Guns,
        forceFields: number,
        forceFieldTimeLeft: number,
        pause: () => void
    ) {
        super()

        window.addEventListener('keydown', event => { if(event.key == 'Escape') pause() })
        const pauseButton = new Button(
            pause,
            {
                size: { x: 200, y: 50 },
                label: 'Pause',
                labelColor: Colors.MENU_BUTTON,
                labelHoverColor: Colors.MENU_BUTTON_HOVER,
                texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER)
            }
        )
        pauseButton.position.set(100, 25)
        this.addChild(pauseButton)

        this.levelName = new BitmapText(levelName, { fontName: 'buttonLabelFont', tint: 0x000000, maxWidth: RENDERER_SIZE.x - GAME_SIZE.x })
        this.levelName.anchor.set(0.5)
        this.levelName.position.set(100, 100)
        this.addChild(this.levelName)

        this.infoContainer = new Container()
        this.infoContainer.pivot.set(100, 0)
        this.infoContainer.position.set(110, 160)

        ;([
            new BitmapText(`${(Math.floor(info.time || 0)).toString()}s`, { fontName: 'buttonLabelFont', tint: Colors.MENU_BUTTON }),
            new BitmapText(`${(info.score || 0).toString()} ${info.score == 1? 'point': 'points'}`, { fontName: 'buttonLabelFont', tint: Colors.MENU_BUTTON }),
            new BitmapText(`${(((lives || 0) > 0? lives: 0) || 0).toString()} ${lives == 1? 'live': 'lives'}`, { fontName: 'buttonLabelFont', tint: Colors.MENU_BUTTON }),
            new BitmapText([ 'Harpoon', 'Double Harpoon', 'Power Wire', 'Vulcan Missile' ][gun || 0], { fontName: 'buttonLabelFont', tint: Colors.MENU_BUTTON }),
            new BitmapText(`${Math.ceil(info.clockTimeLeft || 0)?.toString()}s Clock`, { fontName: 'buttonLabelFont', tint: Colors.MENU_BUTTON }),
            new BitmapText(`${Math.ceil(info.hourglassTimeLeft || 0)?.toString()}s Hourglass`, { fontName: 'buttonLabelFont', tint: Colors.MENU_BUTTON }),
            new BitmapText(`${Math.ceil(forceFieldTimeLeft || 0)?.toString()}s ${forceFields || 0} Shield`, { fontName: 'buttonLabelFont', tint: Colors.MENU_BUTTON }),
        ] as Array<BitmapText>).forEach((text, i) => {
            text.position.set(0, i * 40 + (i > 3? 20: 0))
            this.infoContainer.addChild(text)
        })
        this.addChild(this.infoContainer)

        this.updateInfo(
            info,
            lives,
            gun,
            forceFields,
            forceFieldTimeLeft
        )
    }

    updateInfo(
        info: LevelInfo,
        lives: number,
        gun: Guns,
        forceFields: number,
        forceFieldTimeLeft: number
    ) {
        const newInfo = [
            `${(Math.floor(info.time || 0)).toString()}s`,
            `${(info.score || 0).toString()} ${info.score == 1? 'point': 'points'}`,
            `${(((lives || 0) > 0? lives: 0) || 0).toString()} ${lives == 1? 'live': 'lives'}`,
            [ 'Harpoon', 'Double Harpoon', 'Power Wire', 'Vulcan Missile' ][gun || 0],
            ... ([
                `${Math.ceil(info.clockTimeLeft || 0)?.toString()}s Clock`,
                `${Math.ceil(info.hourglassTimeLeft || 0)?.toString()}s Hourglass`,
                `${Math.ceil(forceFieldTimeLeft || 0)?.toString()}s ${forceFields || 0} Shield`
            ] as Array<string>).filter(text => text[0] != '0')
        ]

        this.infoContainer.children.forEach((child, i) => (child as BitmapText).text = newInfo[i])
    }
}