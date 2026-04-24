import Gameboard from './gameboard.js'
import Ship from './ship.js'
import Player from './player.js'
import Computer from './computer.js'

export default class Controller {
   human = null
   computer = null
   currentPlayer = null

   #switchPlayer(currentPlayer) {
      return currentPlayer === this.human ? this.computer : this.human
   }

   #getEnemyGB(currentPlayer) {
      return currentPlayer === this.human ? this.computer.gameboard : this.human.gameboard
   }

   init(humanGB, name) {
      this.human = new Player(humanGB, name)
      this.computer = new Computer(new Gameboard())
      this.currentPlayer = this.human
   }

   start() {
      while (true) {
         let enemyGB = this.#getEnemyGB(this.currentPlayer)
         let [x, y] = prompt(`${this.currentPlayer.name}'s Turn : Enter coords >`).split(' ')
         enemyGB.receiveAtk(x, y)

         if (enemyGB.areAllShipsSunk()) {
            alert(`Winner ${this.currentPlayer.name}`)
            break
         }

         this.currentPlayer = this.#switchPlayer(this.currentPlayer)
      }
   }
}
