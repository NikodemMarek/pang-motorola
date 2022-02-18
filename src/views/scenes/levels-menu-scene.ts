import { Scene } from 'pixi-scenes'
import { ImagesProvider } from '../../assets-provider'
import { Colors, ImagePath, RENDERER_SIZE } from '../../const'
import Button from '../button'
import Menu from '../menu'

export default class LevelsMenuScene extends Scene {
    levelNames: Array<string>

    levelChosen: (levelName: string) => void
    saved: (() => void) | undefined
    exit: () => void

    constructor(
        levelNames: Array<string>,
        onLevelChosen: (levelName: string) => void,
        onExit: () => void,
        onSaved?: () => void
    ) {
        super()
        
        this.levelNames = levelNames

        this.levelChosen = onLevelChosen
        this.saved = onSaved
        this.exit = onExit
    }

    override init(): void {
        const columnLength = Math.ceil(this.levelNames.length / 3)
        const easyLevels = new Menu(
            [
                ... this.levelNames.slice(0, columnLength).map(levelName => {
                    return {
                        onClick: () => this.levelChosen(levelName),
                        properties: {
                            label: levelName,
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
        const mediumLevels = new Menu(
            [
                ... this.levelNames.slice(columnLength, columnLength * 2).map(levelData => {
                    return {
                        onClick: () => this.levelChosen(levelData),
                        properties: {
                            label: levelData,
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
        const hardLevels = new Menu(
            [
                ... this.levelNames.slice(columnLength * 2, columnLength * 3).map(levelData => {
                    return {
                        onClick: () => this.levelChosen(levelData),
                        properties: {
                            label: levelData,
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

        easyLevels.position.set(RENDERER_SIZE.x / 4 - 50, RENDERER_SIZE.y / 2)
        mediumLevels.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
        hardLevels.position.set(RENDERER_SIZE.x / 4 * 3 + 50, RENDERER_SIZE.y / 2)

        this.addChild(easyLevels)
        this.addChild(mediumLevels)
        this.addChild(hardLevels)

        const exitButton = new Button(
            this.exit,
            {
                label: 'Back',
                size: { x: 300, y: 50 },
                texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                labelColor: Colors.MENU_BUTTON,
                labelHoverColor: Colors.MENU_BUTTON_HOVER
            }
        )
        exitButton.position.set(RENDERER_SIZE.x / 4 * 3 + 50, RENDERER_SIZE.y - 50)
        this.addChild(exitButton)

        if(this.saved != undefined) {
            const loadGameButton = new Button(
                this.saved,
                {
                    label: 'Saved Games',
                    size: { x: 300, y: 50 },
                    texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                    hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                    labelColor: Colors.MENU_BUTTON,
                    labelHoverColor: Colors.MENU_BUTTON_HOVER
                }
            )
            loadGameButton.position.set(RENDERER_SIZE.x / 4 - 50, RENDERER_SIZE.y - 50)
            this.addChild(loadGameButton)
        }
    }
}