import { Application, Text, TextStyle } from 'pixi.js'

const app = new Application({
    view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0xf0f0f0,
    width: 800,
    height: 500
})

const styly: TextStyle = new TextStyle({
    align: "center",
    fill: 0x00ff00,
    fontSize: 42
})
const texty: Text = new Text('motorola science cup, yay!', styly)

app.stage.addChild(texty)