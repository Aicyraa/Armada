import Gameboard from './gameboard.js'
import Ship from './ship.js'
import Player from './player.js'
import Computer from './computer.js'

export default class Controller extends DOM {
   human = null
   computer = null
   currentPlayer = null

   #isPosEmpty(board, positions) {
      for (const currPos of positions) {
         const [x, y] = currPos
         if (board[x][y] !== 0) {
            return false
         }
      }
      return true
   }

   #isPosValid(positions) {
      for (const currPos of positions) {
         const [x, y] = currPos
         if (x >= 10 || y >= 10) {
            return false
         }
      }
      return true
   }

   #generatePos(length, x, y, isVertical) {
      const positions = [[x, y]]
      for (let i = 0; i < length - 1; i++) {
         const [x, y] = positions[positions.length - 1]
         isVertical ? positions.push([x - 1, y]) : positions.push([x, y + 1])
      }
      return positions
   }

   #switchPlayer(currentPlayer) {
      return currentPlayer === this.human ? this.computer : this.human
   }

   #getEnemyGB(currentPlayer) {
      return currentPlayer === this.human ? this.computer.gameboard : this.human.gameboard
   }

   #setPlayerShips() {
      const shipsConfig = [
         { length: 2, name: 'Patrol Boat' },
         { length: 3, name: 'Destroyer' },
         { length: 4, name: 'Battleship' },
      ]

      for (const ship of shipsConfig) {
         while (true) {
            // this will change when the DOM is implemented
            const [x, y, direction] = prompt(` > `)
               .split(' ')
               .map(v => parseInt(v))
            const positions = this.#generatePos(ship.length, x, y, direction == 1 ? true : false)

            if (
               this.#isPosEmpty(this.human.gameboard.board, positions) &&
               this.#isPosValid(positions)
            ) {
               console.log('Test')
               new Ship(this.human.gameboard, ship.length, positions)
               break
            }
            continue
         }
      }
   }

   #setComputerShips() {
      const shipsConfig = [
         { length: 2, name: 'Patrol Boat' },
         { length: 3, name: 'Destroyer' },
         { length: 4, name: 'Battleship' },
         { length: 2, name: 'Patrol Boat' },
         { length: 1, name: 'Lifeboat' },
      ]

      for (const ship of shipsConfig) {
         while (true) {
            const { x, y, direction } = this.computer.getRandomPosition()
            const positions = this.#generatePos(ship.length, x, y, direction)
            if (
               this.#isPosEmpty(this.computer.gameboard.board, positions) &&
               this.#isPosValid(positions)
            ) {
               new Ship(this.computer.gameboard, ship.length, positions)
               break
            }
            continue
         }
      }
   }

   init() {
      const GBS = [new Gameboard(), new Gameboard()]
      this.human = new Player(GBS[0], 'Jee', true)
      this.computer = new Computer(GBS[1], 'Tyler')
      this.#setPlayerShips()
      this.#setComputerShips()
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
