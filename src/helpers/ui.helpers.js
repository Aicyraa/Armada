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
      const [x, y] = positions[positions.length - 1]
      isVertical ? positions.push([x - 1, y]) : positions.push([x, y + 1])
   }
   return positions
}

// UI - Helpers

export function hide(element) {
   element.classList.add('hide')
}

export function unhide(element) {
   element.classList.remove('hide')
}

export function renderBoard(owne) {
   const board = document.createElement('div')
   board.className = `board`

   for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
         const cell = document.createElement('div')
         cell.className = 'cell'
         cell.id = `${i}-${j}`
         board.appendChild(cell)
      }
   }

   return board
}

export function markCell(event) {
   document.querySelectorAll('.cell').forEach(c => c.className = 'cell')
   const cell = event.target
   cell.classList.add('marked')
}

export function extractCoords() {
   const cell = document.querySelector('.marked')
   return cell.id.split('-').map(c => parseInt(c))
}
