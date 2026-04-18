export default class Gameboard {
   board = Array.from({ length: 10 }, () => Array(10).fill(0))
   ships = []

   #isShotValid(x, y) {
      if (this.board[x][y] === 1 || x >= 10 || y >= 10) {
         return false
      } else {
         this.board[x][y] = 1
         return true
      }
   }

   setShip(ship, positions) {
      this.ships.push(ship)
      for (const currPos of positions) {
         const [x, y] = currPos
         this.board[x][y] = ship
      }
   }

   receiveAtk(x, y) {
      const cell = this.board[x][y]
      if (this.#isShotValid(x, y)) {
         if (cell) {
            cell.hit()
            return { c: '#f97575', hit: true }
         } else {
            return { c: '#f5f2f2', hit: false }
         }
      }
   }

   areAllShipsSunk() {
      return this.ships.every(ship => ship.isSunk())
   }
}
