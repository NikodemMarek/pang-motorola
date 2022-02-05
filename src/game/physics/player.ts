import { GRAVITY, Guns, Keymap, PLAYER_SIZE, PLAYER_SPEED, PowerUp } from '../../const'
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
    
    /**
     * Aktywna broń.
     */
    gun: Guns
    /**
     * Opóźnienie strzału / 'przeładowanie'.
     */
    cooldown: number
    /**
     * Pamięta czy broń była wystrzelona drugi raz, jeśli aktywna broń to podwójny harpun.
     */
    shotTwoTimes: boolean = false
    /**
     * Funcja która wykonuje się po przyciśnięcui przycisku strzału.
     */
    shoot: () => void

    /**
     * Ilość tarczy ochronnych które podniósł gracz.
     */
    forceFields: number = 0
    /**
     * Czas który pozostał do zniknięcia tarczy ochronnej.
     */
    forceFieldsTimeLeft: number = 0

    /**
     * Tworzy postać w kształcie {@link RectangularBody | prostokąta}, nadaje mu pozycję startową i wymiary, grawitację, oraz mapę klawiszy.
     * Przechwytuje interakcje gracza z klawiaturą i dodaje oraz usuwa wykonywane ruchy z {@link moves}.
     * Ruchy są dodawane do {@link moves}, zamiast bezpośrednio zmienić prędkości postaci, aby osiągnąć płyność ruchu.
     *
     * @param position - Pozycja startowa postaci, umieszczona w jego centrum
     * @param keymap - Mapa klasiszy sterujących postacią
     * @param gun - Rodzaj broni dla postaci, domyślnie harpun
     * @param shoot - Funkcja która wykona się po przyciśnięciu przycisku strzału przez gracza
     */
    constructor(
        position: XYVar,
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
        super(position, PLAYER_SIZE, true)
        
        this.gun = gun
        this.cooldown = 0
        this.shoot = shoot || function() {  }

        this.accelerate('gravity', GRAVITY)

        window.addEventListener('keydown', event => this.moves.add(Object.entries(keymap).find(key => key[1].includes(event.key))?.[0]))
        window.addEventListener('keyup', event => this.moves.delete(Object.entries(keymap).find(key => key[1].includes(event.key))?.[0]))

        window.addEventListener('contextmenu', event => {
            event.preventDefault()
            return false
        }, false)
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
                    if(isOnLadder) this.speed.y = -PLAYER_SPEED.y
                break;
                case 'DOWN':
                    if(isOnLadder) this.speed.y = PLAYER_SPEED.y
                    else {
                        this.position.y += 1

                        collidingLadder = ladders?.find(ladder => isInsideLadder(ladder))
                        isOnLadder = collidingLadder != undefined

                        if(!isOnLadder) this.position.y -= 1
                        else this.speed.y = PLAYER_SPEED.y
                    }
                break;
                case 'LEFT':
                    if(!isOnLadder) this.speed.x = -PLAYER_SPEED.x
                    else if(!colliders?.some(collider => collider instanceof PlatformBody && this.isColliding(collider) && collidingLadder?.isColliding(collider))) this.speed.x = -PLAYER_SPEED.x
                break;
                case 'RIGHT':
                    if(!isOnLadder) this.speed.x = PLAYER_SPEED.x
                    else if(!colliders?.some(collider => collider instanceof PlatformBody && this.isColliding(collider) && collidingLadder?.isColliding(collider))) this.speed.x = PLAYER_SPEED.x
                break;
                case 'SHOOT':
                    if(this.cooldown <= 0) {
                        this.shoot()

                        switch(this.gun) {
                            case Guns.HARPOON:
                            case Guns.POWER_WIRE:
                                this.cooldown = 1
                            break;
                            case Guns.VULCAN_MISSILE:
                                this.cooldown = 0.2
                            break;
                            case Guns.DOUBLE_HARPOON:
                                this.cooldown = this.shotTwoTimes? 1: 0.2
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
            this.accelerate('gravity', GRAVITY)
        }
        
        super.update(
            delta,
            isOnLadder? colliders?.filter(collider => !(collider instanceof PlatformBody) || !collidingLadder!.isColliding(collider) && collider.position.y - collider.size.y / 2 < this.position.y + this.size.y / 2):
                colliders?.concat(ladders != undefined? ladders!.filter(ladder => ladder.position.y - ladder.size.y / 2 + delta > this.position.y + this.size.y / 2): [  ])
        )

        this.cooldown -= delta
    
        if(this.forceFieldsTimeLeft > 0) this.forceFieldsTimeLeft -= delta
        else this.forceFields = 0
    }

    powerUp(type: PowerUp) {
        switch(type) {
            case PowerUp.HARPOON:
                this.gun = Guns.HARPOON
            break;
            case PowerUp.DOUBLE_HARPOON:
                this.gun = Guns.DOUBLE_HARPOON
            break;
            case PowerUp.POWER_WIRE:
                this.gun = Guns.POWER_WIRE
            break;
            case PowerUp.VULCAN_MISSILE:
                this.gun = Guns.VULCAN_MISSILE
            break;
            case PowerUp.FORCE_FIELD:
                this.forceFields ++
                this.forceFieldsTimeLeft += 20
            break;
        }
    }
}
