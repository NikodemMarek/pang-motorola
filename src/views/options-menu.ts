import { getImagesSetsList, ImagesProvider } from '../assets-provider'
import { ImagePath } from '../const'
import Menu from './menu'

export default class OptionsMenu extends Menu {
    constructor(
        refresh: () => void,
        exit: () => void
    ) {
        super(
            [
                ... getImagesSetsList().map((set, i) => {
                    return {
                        onClick: () => {
                            ImagesProvider.Instance().loadSet(i)
                            refresh()
                        },
                        properties: {
                            label: set.name
                        }
                    }
                }),
                {
                    onClick: exit,
                    properties: {
                        label: 'Exit'
                    }
                }
            ],
            {
                texture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON),
                hoverTexture: ImagesProvider.Instance().getTexture(ImagePath.MENU_BUTTON_HOVER),
                labelColor: 0x666666,
                labelHoverColor: 0x111111,
                size: {
                    x: 400,
                    y: 50
                }
            }
        )
    }
}