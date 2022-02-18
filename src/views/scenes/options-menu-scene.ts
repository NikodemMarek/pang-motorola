import { Scene } from 'pixi-scenes'
import { getImagesSetsList, ImagesProvider } from '../../assets-provider'
import { Colors, ImagePath, RENDERER_SIZE } from '../../const'
import Menu from '../menu'

export default class OptionsMenuScene extends Scene {
    load: (setNumber: number) => void
    exit: () => void

    constructor(
        load: (setNumber: number) => void,
        onExit: () => void
    ) {
        super()
        
        this.load = load
        this.exit = onExit
    }

    override init(): void {
        const menu = new Menu(
            [
                ... getImagesSetsList().map((set, i) => {
                    return {
                        onClick: () => this.load(i),
                        properties: {
                            label: set.name
                        },
                        hideMenuOnClick: false
                    }
                }),
                {
                    onClick: this.exit,
                    properties: {
                        label: 'Back'
                    },
                    hideMenuOnClick: false
                }
            ],
            {
                texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                labelColor: Colors.MENU_BUTTON,
                labelHoverColor: Colors.MENU_BUTTON_HOVER,
                size: {
                    x: 400,
                    y: 50
                }
            },
            false
        )
        menu.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
        this.addChild(menu)
    }
}