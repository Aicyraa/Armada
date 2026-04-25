import Player from './player.js'
import Ship from './ship.js'
import { isPosEmpty, isPosValid, generatePos } from '../helpers/logic.helper.js'

export default class Computer extends Player {
   #lastHit = null
   #potentialTargets = []
   #triedShots = new Set()

   constructor(gameboard) {
      const names = [
         'Captain Ironclad Drake',
         'Captain Elias Stormbreaker',
         'Captain Victor Blacktide',
         'Captain Magnus Steelwave',
         'Captain Orion Deepwater',
      ]

      super(gameboard, names[Math.floor(Math.random() * 5)])
      this.#setComputerShips()
   }

   #setComputerShips() {
      const shipsConfig = [
         { length: 2, name: 'Patrol Boat' },
         { length: 3, name: 'Destroyer' },
         { length: 4, name: 'Battleship' },
      ]
      
      for (const ship of shipsConfig) {
         while (true) {
            const x = Math.floor(Math.random() * 10)
            const y = Math.floor(Math.random() * 10)
            const isVertical = Math.random() < 0.5 ? true : false
            const positions = generatePos(ship.length, x, y, isVertical)

            if (isPosValid(positions) && isPosEmpty(this.gameboard.board, positions)) {
               new Ship(this.gameboard, ship.length, positions)
               break
            }
         }
      }
   }


   /**
    * Generates attack coordinates with basic hunt-and-target logic
    * @returns {number[]} - [x, y] coordinates
    */
   getAtkCoords() {
      // If we have potential targets from a previous hit, use them
      if (this.#potentialTargets.length > 0) {
         const target = this.#potentialTargets.pop()
         const [x, y] = target

         if (!this.#triedShots.has(`${x},${y}`) && x >= 0 && x < 10 && y >= 0 && y < 10) {
            this.#triedShots.add(`${x},${y}`)
            return [x, y]
         }
      }

      // Random hunt mode
      let attempts = 0
      while (attempts < 100) {
         const x = Math.floor(Math.random() * 10)
         const y = Math.floor(Math.random() * 10)

         if (!this.#triedShots.has(`${x},${y}`)) {
            this.#triedShots.add(`${x},${y}`)
            return [x, y]
         }
         attempts++
      }

      return null
   }

   /**
    * Records the result of an attack to inform future targeting
    * @param {number} x - X coordinate of the attack
    * @param {number} y - Y coordinate of the attack
    * @param {boolean} hit - Whether the attack hit
    */
   recordAttackResult(x, y, hit) {
      if (hit) {
         this.#lastHit = [x, y]
         // Add adjacent cells as potential targets
         const adjacent = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
         ]
         // Shuffle to make targeting less predictable
         for (let i = adjacent.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[adjacent[i], adjacent[j]] = [adjacent[j], adjacent[i]]
         }
         this.#potentialTargets.push(...adjacent)
      }
   }
}
