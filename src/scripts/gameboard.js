export default class Gameboard {
   /* 
      Notes:
      M (setShip) -> Place ships at specified coordinates (Pririty)  We are going to use 0 for no entity and 1 for entity 
      M (receiveAtk) -> Receive Attack that accepts x,y coordinates that invokes the hit function when a ship is hit
      M (checkShips) -> Check if all ships are sunkedn 
   */

   /* 
      To Do:
      1. Assign the ship object to the generated positions in "position"
      2. Validation when setting up ship object
         * The coordinates should not exceed 10x10.
         * The cell should be empty.
      3. Create a game class for managing the game extending the UI class? 
   */

   board = Array.from({ length: 5 }, () => Array(5).fill(0))

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

   setShip(ship, { length, x, y, isVertical }) {
      const positions = [[x, y]]
      // Adds a new position (For expanding the ship in the board)
      for (let i = 0; i < length - 1; i++) {
         const [x, y] = positions[positions.length - 1]
         isVertical ? positions.push([x - 1, y]) : positions.push([x, y + 1])
      }

      // Expand the ship on the board
      if (this.#isPosEmpty(positions)) {
         for (let currPos of positions) {
            const [x, y] = currPos
            this.board[x][y] = ship
         }
      }
   }
}
