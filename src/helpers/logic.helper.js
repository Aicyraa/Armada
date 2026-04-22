// Logic - Helpers

export function isPosEmpty(board, positions) {
   console.log(board)
   for (const currPos of positions) {
      const [x, y] = currPos

      console.log(x, y)
      if (board[x][y] !== 0) {
         return false
      }
   }
   return true
}

export function isPosValid(positions) {
   for (const currPos of positions) {
      const [x, y] = currPos
      if (x >= 10 || y >= 10 || x < 0 || y < 0) {
         return false
      }
   }
   return true
}

export function generatePos(length, x, y, isVertical) {
   const positions = [[x, y]]
   for (let i = 0; i < length - 1; i++) {
      const [lastX, lastY] = positions[positions.length - 1]
      isVertical ? positions.push([lastX + 1, lastY]) : positions.push([lastX, lastY + 1])
   }
   return positions
}
