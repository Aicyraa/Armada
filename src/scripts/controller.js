import Gameboard from './gameboard.js'
import Ship from './ship.js'
import Player from './player.js'

export default class Controller {
   /* 
      Functions:
      This class is instantiate when the player pressed start
      * init -> Initializes the players and their respective gameboard
      * manageShips -> Make the 2 players set their ship 
      * start -> Start ng battle. 
         * This function loops like this. ( Shoot, check ships, switch ) Then repeat  
      * notifyPlayer -> A methods that choose a random text (arr) when the players shot 
         * Seperate arrays for hit shot and missed shot  
         * 
      *   
   */

   human = null
   computer = null
   currentPlayer = null

   #manageShips() {
      const ships = [
         [
            { length: 2, x: 0, y: 2, isVertical: false },
            { length: 2, x: 2, y: 2, isVertical: false },
            { length: 2, x: 4, y: 1, isVertical: false },
         ],
         [
            { length: 2, x: 0, y: 0, isVertical: false },
            { length: 2, x: 4, y: 4, isVertical: true },
            { length: 2, x: 0, y: 3, isVertical: false },
         ],
      ]

      ships.forEach((v, i) => {
         if (i === 0) {
            v.forEach(config => {
               new Ship(this.human.gameboard, {...config})
            })
         } else {
            v.forEach(config => {
               new Ship(this.computer.gameboard, {...config})
            })
         }
      })
   }

   #switchPlayer(currentPlayer) {
      return currentPlayer === this.human ? this.computer : this.human
   }

   #getEnemyGB(currentPlayer) {
      return currentPlayer === this.human ? this.computer.gameboard : this.human.gameboard
   }

   init() {
      const GBS = [new Gameboard(), new Gameboard()]
      this.human = new Player(GBS[0], 'Jee', true)
      this.computer = new Player(GBS[1], 'Tyler')
      this.#manageShips()
   }

   start() {
      while (true) {
         let enemyGB = this.#getEnemyGB(currentPlayer)
         let [x, y] = (prompt(`${currentPlayer.name}'s Turn : Enter coords >`)).split(' ')
         enemyGB.receiveAtk(x, y)
         
         if (enemyGB.areAllShipsSunk()) {
            alert(`Winner: ${currentPlayer.name}` )
            break
         } else {
            currentPlayer = this.#switchPlayer(currentPlayer)
         }
      }
   }
}
