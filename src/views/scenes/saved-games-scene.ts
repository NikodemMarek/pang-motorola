import { Scene } from 'pixi-scenes'
import { ImagesProvider } from '../../assets-provider'
import { Colors, ImagePath, RENDERER_SIZE } from '../../const'
import { savedGamesList } from '../../levels-provider'
import Button from '../button'
import Menu from '../menu'

export default class SavedGamesScene extends Scene {
    mode: string

    gameChosen: (gameName: string) => void
    exit: () => void

    constructor(
        mode: string,
        onGameChosen: (gameName: string) => void,
        onExit: () => void
    ) {
        super()

        this.mode = mode

        this.gameChosen = onGameChosen
        this.exit = onExit
    }

    override start(): void {
        this.removeChildren(0, this.children.length)
        
        const savedGames = savedGamesList(this.mode)
        const games = new Menu(
            [
                ... savedGames.map(gameName => {
                    return {
                        onClick: () => this.gameChosen(gameName),
                        properties: {
                            label: gameName,
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
        games.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
        this.addChild(games)

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