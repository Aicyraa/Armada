import Gameboard from './gameboard.js'

export default class Ship {
   /**
    * Initialize length and hits property of the ship.
    * Details object are passed to Gameboard Class to set the ships positin within its board
    * @param {Gameboard} gameboard - The player / computer gameboard
    * @param {Object} details - The details of the ship (Length, position (x, y), isVertical)
    * @returns Ship
    */
   constructor(gameboard, details) {
      this.length = details.length
      this.hits = 0
      gameboard.setShip(this, details)
   }

   hit() {
      this.hits += 1
   }

   isSunk() {
      return this.length === this.hits ? true : false
   }
}
