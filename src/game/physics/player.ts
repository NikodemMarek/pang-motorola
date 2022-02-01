import { Guns, Keymap } from '../../const'
import { XYVar } from '../../types'
import { Body, RectangularBody } from './bodies'
import { LadderBody, PlatformBody } from './objects'

/**
 * Klasa opisująca zachowanie obiektu postaci.
 * Klasa jest także odpowiedzialna za kontrole gracza nad postacią.
 */
export default class PlayerBody extends RectangularBody {
  /**
   * Wszystkie ruchy które jednocześnie wykonuje gracz.
   */
  moves = new Set()
  
  gun: Guns
  cooldown: number
  shotTwoTimes: boolean = false
  shoot: () => void

  /**
   * Tworzy postać w kształcie {@link RectangularBody | prostokąta}, nadaje mu pozycję startową i wymiary, grawitację, oraz mapę klawiszy.
   * Przechwytuje interakcje gracza z klawiaturą i dodaje oraz usuwa wykonywane ruchy z {@link moves}.
   * Ruchy są dodawane do {@link moves}, zamiast bezpośrednio zmienić prędkości postaci, aby osiągnąć płyność ruchu.
   *
   * @param position - Pozycja startowa postaci, umieszczona w jego centrum
   * @param size - Rozmiar postaci
   * @param keymap - Mapa klasiszy sterujących postacią
   */
  constructor(
    position: XYVar,
    size: XYVar,
    keymap: {
        UP: Array<string>,
        DOWN: Array<string>,
        LEFT: Array<string>,
        RIGHT: Array<string>,
        SHOOT: Array<String>
    } = Keymap,
    gun: Guns = Guns.HARPOON,
    shoot?: () => void
  ) {
    super(position, size, true)
    
    this.gun = gun
    this.cooldown = 0
    this.shoot = shoot || function() {  }

    this.accelerate('gravity', { x: 0, y: 50 })

    window.addEventListener('keydown', event => this.moves.add(Object.entries(keymap).find(key => key[1].includes(event.key))?.[0]))
    window.addEventListener('keyup', event => this.moves.delete(Object.entries(keymap).find(key => key[1].includes(event.key))?.[0]))
  }

  /**
   * Funkcja odświeża prędkość gracza w poziomie.
   * Następnie zmienia wartości parametrów ciała w zależności od czasu.
   *
   * @param delta - Czas jaki wyświetlana była poprzednia klatka
   * @param colliders - Tablica z ciałami które mogą kolidować z postacią
   * @param ladders - Tablica z drabinami na których może znajdować się postać
   */
  override update(delta: number, colliders?: Body[], ladders?: LadderBody[]): void {
    const isInsideLadder = (ladder: LadderBody) =>
      this.isColliding(ladder) &&
      this.position.x - this.size.x / 2 > ladder.position.x - ladder.size.x / 2 &&
      this.position.x + this.size.x / 2 < ladder.position.x + ladder.size.x / 2

    let collidingLadder = ladders?.find(ladder => isInsideLadder(ladder))
    let isOnLadder = collidingLadder != undefined

    if(isOnLadder) this.speed.y = 0

    this.speed.x = 0
    this.moves.forEach(move => {
        switch(move) {
             case 'UP':
                if(isOnLadder) this.speed.y = -60
            break;
          case 'DOWN':
                if(isOnLadder) this.speed.y = 60
          else {
            this.position.y += 1

            collidingLadder = ladders?.find(ladder => isInsideLadder(ladder))
            isOnLadder = collidingLadder != undefined

            if(!isOnLadder) this.position.y -= 1
            else this.speed.y = 60
          }
          break;
        case 'LEFT':
          if(!isOnLadder || isOnLadder && this.position.y + this.size.y / 2 >= collidingLadder!.position.y + collidingLadder!.size.y / 2) this.speed.x = -50
        break;
        case 'RIGHT':
          if(!isOnLadder || isOnLadder && this.position.y + this.size.y / 2 >= collidingLadder!.position.y + collidingLadder!.size.y / 2) this.speed.x = 50
        break;
        case 'SHOOT':
            if(this.cooldown <= 0) {
                this.shoot()
                switch(this.gun) {
                    case Guns.HARPOON:
                    case Guns.POWER_WIRE:
                        this.cooldown = 1.5
                    break;
                    case Guns.VULCAN_MISSILE:
                        this.cooldown = 0.5
                    break;
                    case Guns.DOUBLE_WIRE:
                        this.cooldown = this.shotTwoTimes? 1.5: 0.3
                        this.shotTwoTimes = !this.shotTwoTimes
                    break;
                }
            }
        break;
      }
    })
    
    if(isOnLadder) this.decelerate('gravity')
    else if(!this.accelerators.some(acc => acc.name == 'gravity')) {
        this.speed.y = 0
        this.accelerate('gravity', { x: 0, y: 50 })
    }
    
    super.update(
        delta,
        isOnLadder? colliders?.filter(collider => !(collider instanceof PlatformBody) ||
        !collidingLadder!.isColliding(collider) && collider.position.y - collider.size.y / 2 < this.position.y + this.size.y / 2): colliders
    )

    this.cooldown -= delta
  }
}
