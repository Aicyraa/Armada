// UI - Helpers

export function hide(element) {
   element.classList.add('hide')
}

export function unhide(element) {
   element.classList.remove('hide')
}

export function renderOwnBoard(gameboard) {
   const board = document.createElement('div')
   board.className = 'board own-board'

   const cells = []
   for (let i = 0; i < 10; i++) {
      const row = []
      for (let j = 0; j < 10; j++) {
         const cell = document.createElement('div')
         cell.className = 'cell'
         cell.dataset.row = i
         cell.dataset.col = j
         board.appendChild(cell)
         row.push(cell)
      }
      cells.push(row)
   }

   for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
         const content = gameboard.board[i][j]

         if (content !== 0) {
            cells[i][j].classList.add('ship')
            cells[i][j].dataset.shipId = content.id
            if (content.hits > 0) cells[i][j].classList.add('damaged')
         }
      }
   }

   return board
}

export function renderEnemyBoard() {
   const board = document.createElement('div')
   board.className = 'board enemy-board'

   for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
         const cell = document.createElement('div')
         cell.className = 'cell'
         cell.dataset.row = i
         cell.dataset.col = j
         board.appendChild(cell)
      }
   }

   return board
}

export function attackCell(event, enemyGB) {
   const cell = event.target.closest('.cell')
   if (!cell) return
   if (cell.classList.contains('hit') || cell.classList.contains('miss')) return

   const x = parseInt(cell.dataset.row)
   const y = parseInt(cell.dataset.col)
   const result = enemyGB.receiveAtk(x, y)

   cell.classList.add(result.hit ? 'hit' : 'miss')
   return { x, y, hit: result.hit }
}

export function createShipElement(shipId, partIndex) {
   const span = document.createElement('span')
   span.className = 'blocks'
   span.dataset.shipId = shipId
   span.dataset.part = partIndex
   return span
}