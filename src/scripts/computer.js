import Player from './player.js'

export default class Computer extends Player {
   #lastHit = null
   #potentialTargets = []
   #triedShots = new Set()

   constructor(gameboard, name) {
      super(gameboard, name)
   }

   /**
    * Generates random valid coordinates for ship placement
    * @param {number} length - Length of the ship
    * @returns {Object} - {x, y, isVertical} or null if no valid position found
    */
   getRandomPosition(length) {
      const x = Math.floor(Math.random() * 10)
      const y = Math.floor(Math.random() * 10)
      const isVertical = Math.random() < 0.5 ? true : false
      return { x, y, isVertical }
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

         if (
            !this.#triedShots.has(`${x},${y}`) &&
            x >= 0 &&
            x < 5 &&
            y >= 0 &&
            y < 5
         ) {
            this.#triedShots.add(`${x},${y}`)
            return [x, y]
         }
      }

      // Random hunt mode
      let attempts = 0
      while (attempts < 25) {
         const x = Math.floor(Math.random() * 5)
         const y = Math.floor(Math.random() * 5)

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
