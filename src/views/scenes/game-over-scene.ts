import { Scene } from 'pixi-scenes'
import { ImagesProvider } from '../../assets-provider'
import { Colors, ImagePath, RENDERER_SIZE, ZIndex } from '../../const'
import { ButtonProperties } from '../../types'
import Menu from '../menu'

export default class GameOverScene extends Scene {
    finish: () => void
    saveToScoreboard: (() => void) | undefined
    nextLevel: (() => void) | undefined

    score: number
    won: boolean | undefined

    constructor(
        onFinish: () => void,
        score: number,
        won?: boolean,
        onNextLevel?: () => void,
        onSaveToScoreboard?: () => void
    ) {
        super()

        this.finish = onFinish

        this.score = score
        this.won = won

        this.nextLevel = onNextLevel
        this.saveToScoreboard = onSaveToScoreboard
    }

    override init(): void {
        const options: Array<{
            onClick: (() => void) | undefined,
            properties: ButtonProperties,
            hideMenuOnClick?: boolean
        }> = [
            this.won != undefined? {
                onClick: undefined,
                properties: {
                    label: this.won? 'You Won!': 'You Lost',
                    labelColor: Colors.MENU_BUTTON_HOVER
                },
                hideMenuOnClick: false
            }: undefined,
            {
                onClick: undefined,
                    properties: {
                        label: `${this.score} points`,
                        labelColor: Colors.MENU_BUTTON_HOVER
                    },
                    hideMenuOnClick: false
            },
            this.saveToScoreboard != undefined? {
                onClick: this.saveToScoreboard,
                properties: {
                    label: `Save Score`,
                    texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                    hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                    labelColor: Colors.MENU_BUTTON,
                    labelHoverColor: Colors.MENU_BUTTON_HOVER
                },
                hideMenuOnClick: false
            }: undefined,
            this.nextLevel != undefined? {
                onClick: this.nextLevel,
                properties: {
                    label: `Next Level`,
                    texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                    hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                    labelColor: Colors.MENU_BUTTON,
                    labelHoverColor: Colors.MENU_BUTTON_HOVER
                },
                hideMenuOnClick: false
            }: undefined,
            {
                onClick: this.finish,
                properties: {
                    label: 'Finish',
                    texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                    hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                    labelColor: Colors.MENU_BUTTON,
                    labelHoverColor: Colors.MENU_BUTTON_HOVER
                },
                hideMenuOnClick: false
            }
        ].filter(option => option != undefined) as Array<{
            onClick: (() => void) | undefined,
            properties: ButtonProperties,
            hideMenuOnClick?: boolean
        }>
        
        const gameOverMenu = new Menu(
            options,
            {
                size: { x: 300, y: 50 },
            }
        )
        gameOverMenu.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
        gameOverMenu.zIndex = ZIndex.PAUSE_MENU
        this.addChild(gameOverMenu)
    }
}