import { Scene } from 'pixi-scenes'
import { ImagesProvider } from '../../assets-provider'
import { Colors, ImagePath, RENDERER_SIZE } from '../../const'
import Menu from '../menu'

export default class MainMenuScene extends Scene {
    clicked: (option: number) => void

    constructor(clicked: (option: number) => void) {
        super()

        this.clicked = clicked
    }

    override init(): void {
        const menu = new Menu(
            [
                {
                    onClick: () => this.clicked(0),
                    properties: {
                        label: 'Play',
                    },
                    hideMenuOnClick: false
                },
                {
                    onClick: () => this.clicked(1),
                    properties: {
                        label: 'Options',
                    },
                    hideMenuOnClick: false
                }
            ],
            {
                size: { x: 200, y: 50 },
                texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                labelColor: Colors.MENU_BUTTON,
                labelHoverColor: Colors.MENU_BUTTON_HOVER
            },
            false
        )
        menu.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
        this.addChild(menu)
    }
}