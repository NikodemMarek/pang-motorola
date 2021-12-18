import { Application, Text, TextStyle } from 'pixi.js'

/**
 * Tworzy aplikację we wskazanym kontenerze i określa dodatkowe parametry aplikacji.
 */
const app = new Application({
    view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0xf0f0f0,
    width: 800,
    height: 500
})

/**
 * Definiuje styl tekstu który zostanie użyty na stronie.
 */
const styly: TextStyle = new TextStyle({
    align: "center",
    fill: 0x00ff00,
    fontSize: 42
})

/**
 * Tworzy tekst i wyświetla go na ekranie.
 */
const texty: Text = new Text('motorola science cup, yay!', styly)
app.stage.addChild(texty)