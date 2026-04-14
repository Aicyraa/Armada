export default class Gameboard {
   /* 
      Notes:
      M (setShip) -> Place ships at specified coordinates (Pririty)  We are going to use 0 for no entity and 1 for entity 
      M (receiveAtk) -> Receive Attack that accepts x,y coordinates that invokes the hit function when a ship is hit
      M (checkShips) -> Check if all ships are sunkedn 
   */

   // board = new Array(5).fill(new Array(5)).map(row => row.fill(0))
   board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
   ]

   setShip({ length, x, y, isVertical }) {
      // Note: Wala pa etong validation ng pag set the position ng ship

      const positions = [[x, y]]
      // Adds a new position (For expanding the ship in the board)
      for (let i = 0; i < length - 1; i++) {
         const [x, y] = positions[positions.length - 1]
         isVertical ? positions.push([x - 1, y]) : positions.push([x, y + 1])
      }

      // Expand the ship on the board
      for (let currPos of positions) {
         const [x, y] = currPos
         this.board[x][y] = 1
      }
   }
}
