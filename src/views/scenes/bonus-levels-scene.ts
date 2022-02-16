import { Scene } from 'pixi-scenes'
import { ImagesProvider } from '../../assets-provider'
import { Colors, ImagePath, RENDERER_SIZE } from '../../const'
import { getLevelsList } from '../../levels-provider'
import Button from '../button'
import Menu from '../menu'

export default class BonusLevelsScene extends Scene {
    levelChosen: (levelName: string) => void
    exit: () => void

    constructor(
        onLevelChosen: (levelName: string) => void,
        onExit: () => void
    ) {
        super()

        this.levelChosen = onLevelChosen
        this.exit = onExit
    }

    override init(): void {
        const levels = new Menu(
            [
                ... getLevelsList('bonus').map(levelData => {
                    return {
                        onClick: () => this.levelChosen(levelData.name),
                        properties: {
                            label: levelData.name,
                            texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                            hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                            labelColor: Colors.MENU_BUTTON,
                            labelHoverColor: Colors.MENU_BUTTON_HOVER
                        },
                        hideMenuOnClick: false
                    }
                })
            ],
            {
                size: { x: 300, y: 50 }
            },
            false,
            5
        )
        levels.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
        this.addChild(levels)

        const exitButton = new Button(
            this.exit,
            {
                label: 'Exit',
                size: { x: 300, y: 50 },
                texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                labelColor: Colors.MENU_BUTTON,
                labelHoverColor: Colors.MENU_BUTTON_HOVER
            }
        )
        exitButton.position.set(RENDERER_SIZE.x / 4 * 3 + 50, RENDERER_SIZE.y - 50)
        this.addChild(exitButton)
    }
}