import { Scene } from 'pixi-scenes'
import { ImagesProvider } from '../../assets-provider'
import { Colors, ImagePath, RENDERER_SIZE } from '../../const'
import { getLevelsList } from '../../levels-provider'
import Button from '../button'
import Menu from '../menu'

export default class LevelChoiceScene extends Scene {
    levelChosen: (difficulty: string, levelName: string) => void
    exit: () => void

    constructor(
        onLevelChosen: (difficulty: string, levelName: string) => void,
        onExit: () => void
    ) {
        super()

        this.levelChosen = onLevelChosen
        this.exit = onExit
    }

    override init(): void {
        const easyLevelsData = getLevelsList('easy')
        const easyLevels = new Menu(
            [
                {
                    onClick: () => {  },
                    properties: {
                        label: 'Easy',
                    },
                    hideMenuOnClick: false
                },
                {
                    onClick: () => this.levelChosen('easy', easyLevelsData[Math.floor(Math.random() * easyLevelsData.length)].name),
                    properties: {
                        label: 'Random',
                        texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                        hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                        labelColor: Colors.MENU_BUTTON_HOVER,
                        labelHoverColor: Colors.MENU_BUTTON
                    },
                    hideMenuOnClick: false
                },
                ... easyLevelsData.map(levelData => {
                    return {
                        onClick: () => this.levelChosen('easy', levelData.name),
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

        const mediumLevelsData = getLevelsList('medium')
        const mediumLevels = new Menu(
            [
                {
                    onClick: () => {  },
                    properties: {
                        label: 'Medium',
                    },
                    hideMenuOnClick: false
                },
                {
                    onClick: () => this.levelChosen('medium', mediumLevelsData[Math.floor(Math.random() * mediumLevelsData.length)].name),
                    properties: {
                        label: 'Random',
                        texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                        hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                        labelColor: Colors.MENU_BUTTON_HOVER,
                        labelHoverColor: Colors.MENU_BUTTON
                    },
                    hideMenuOnClick: false
                },
                ... mediumLevelsData.map(levelData => {
                    return {
                        onClick: () => this.levelChosen('medium', levelData.name),
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

        const hardLevelsData = getLevelsList('hard')
        const hardLevels = new Menu(
            [
                {
                    onClick: () => {  },
                    properties: {
                        label: 'Hard',
                    },
                    hideMenuOnClick: false
                },
                {
                    onClick: () => this.levelChosen('hard', hardLevelsData[Math.floor(Math.random() * hardLevelsData.length)].name),
                    properties: {
                        label: 'Random',
                        texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                        hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                        labelColor: Colors.MENU_BUTTON_HOVER,
                        labelHoverColor: Colors.MENU_BUTTON
                    },
                    hideMenuOnClick: false
                },
                ... hardLevelsData.map(levelData => {
                    return {
                        onClick: () => this.levelChosen('hard', levelData.name),
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

        easyLevels.position.set(RENDERER_SIZE.x / 4 - 50, RENDERER_SIZE.y / 2)
        mediumLevels.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
        hardLevels.position.set(RENDERER_SIZE.x / 4 * 3 + 50, RENDERER_SIZE.y / 2)

        this.addChild(easyLevels)
        this.addChild(mediumLevels)
        this.addChild(hardLevels)

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