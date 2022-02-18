import { IScene, SceneManager } from 'pixi-scenes'

export class ScenesNavigator extends SceneManager {
    private scenesStack: Array<string> = [  ]

    override add(name: string, scene: IScene): void {
        super.add(name, scene)

        if(this.scenesStack.length < 1) this.scenesStack.push(name)
    }

    override start(name: string): void {
        this.scenesStack.push(name)
        super.start(name)
    }

    pop(): void {
        const lastName = this.scenesStack.pop()

        if(lastName != undefined) {
            if(this.scenesStack.length > 0) super.start(this.scenesStack[this.scenesStack.length - 1])
            else this.scenesStack.push(lastName)
        }
    }

    override remove(name: string): boolean {
        this.scenesStack = this.scenesStack.filter(sceneName => sceneName != name)
        return super.remove(name)
    }
}