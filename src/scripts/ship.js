export default class Ship {
   hits = 0

   /**
    * Initialize length and hits property of the ship.
    * Details object are passed to Gameboard Class to set the ships positin within its board
    * @param {Gameboard} gameboard - The player / computer gameboard
    * @param {int} length - The length of the boat
    * @param {int[]} positions - An array of position 
    * @returns Ship
    */
   constructor(gameboard, length, positions) {
      this.length = length
      gameboard.setShip(this, positions)
   }

   hit() {
      this.hits += 1
   }

   isSunk() {
      return this.length === this.hits ? true : false
   }
}
