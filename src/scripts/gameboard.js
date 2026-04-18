export default class Gameboard {
   board = Array.from({ length: 5 }, () => Array(5).fill(0))
   ships = []
   
   #isPosEmpty(positions) {
      for (const currPos of positions) {
         const [x, y] = currPos
         if (x >= 10 || y >= 10) {
            return false
         }
      }
      for (const currPos of positions) {
         const [x, y] = currPos
         if (this.board[x][y] !== 0) {
            return false
         }
      }
      return true
   }

   #isShotValid(x, y) {
      if (this.board[x][y] === 1 || x >= 10 || y >= 10) {
         return false
      } else {
         this.board[x][y] = 1
         return true
      }
   }

   setShip(ship, { length, x, y, isVertical }) {
      const positions = [[x, y]]
      for (let i = 0; i < length - 1; i++) {
         // Adds a new position (For expanding the ship in the board)
         const [x, y] = positions[positions.length - 1]
         isVertical ? positions.push([x - 1, y]) : positions.push([x, y + 1])
      }
      if (this.#isPosEmpty(positions)) {
         // Expand the ship on the board
         this.ships.push(ship)   
         for (const currPos of positions) {
            const [x, y] = currPos
            this.board[x][y] = ship
         }
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
