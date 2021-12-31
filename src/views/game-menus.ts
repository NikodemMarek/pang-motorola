import { ImagesProvider } from '../assets-provider'
import { ButtonProperties } from '../types'
import Menu from './menu'

/**
 * Główne menu gry.
 */
export default class MainMenu extends Menu {
    /**
     * Tworzy główne menu gry wykorzystujące klasę {@link views/menu.default | Menu}.
     * Menu zawiera 3 przyciski: Graj, Opcje, Wyjdź.
     */
    constructor() {
        const buttons = [
            {
                onClick: () => console.log('play'),
                properties: {
                    label: 'Play',
                }
            },
            {
                onClick: () => console.log('options'),
                properties: {
                    label: 'Options',
                }
            },
            {
                onClick: () => console.log('exit'),
                properties: {
                    label: 'Exit',
                }
            }
        ]
        const properties: ButtonProperties = {
            width: 200,
            height: 50,
            texture: ImagesProvider.Instance().getTexture(ImagesProvider.image.MENU_BUTTON),
            hoverTexture: ImagesProvider.Instance().getTexture(ImagesProvider.image.MENU_BUTTON_HOVER),
            labelColor: 0x407ff9,
            labelHoverColor: 0xff7ff9
        }

        super(
            buttons,
            properties,
            false
        )
    }
}