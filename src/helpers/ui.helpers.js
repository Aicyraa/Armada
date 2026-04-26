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
            const span = createShipElement(content.id, 0)
            cells[i][j].appendChild(span)
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
   if (!result) return

   if (result.hit) {
      cell.classList.add('hit')
      cell.style.backgroundColor = '#f97575'
   } else {
      cell.classList.add('miss')
      cell.style.backgroundColor = '#f5f2f2'
      const span = document.createElement('span')
      span.className = 'blocks'
      cell.appendChild(span)
   }
   return { x, y, hit: result.hit }
}

export function createShipElement(shipId, partIndex) {
   const span = document.createElement('span')
   span.className = 'blocks'
   span.dataset.shipId = shipId
   span.dataset.part = partIndex
   return span
}

export function showWinModal(isVictory, playerName, onPlayAgain) {
   const modal = document.querySelector('.win-modal')
   const backdrop = document.querySelector('.win-backdrop')

   // Reset classes
   modal.classList.remove('victory', 'defeat')
   modal.classList.add(isVictory ? 'victory' : 'defeat')

   // Set content
   modal.querySelector('.win-title').textContent = isVictory ? 'Victory' : 'Defeat'
   modal.querySelector('.winner-name').textContent = playerName

   // Show modal
   hide(backdrop)
   hide(modal)
   unhide(backdrop)
   unhide(modal)

   // Wire buttons
   const playAgainBtn = document.querySelector('#play-again-btn')
   const mainMenuBtn = document.querySelector('#main-menu-btn')

   // Remove old listeners
   playAgainBtn?.replaceWith(playAgainBtn.cloneNode(true))
   mainMenuBtn?.replaceWith(mainMenuBtn.cloneNode(true))

   // Add new listeners
   document.querySelector('#play-again-btn').addEventListener('click', () => {
      hide(backdrop)
      hide(modal)
      onPlayAgain?.()
   })

   document.querySelector('#main-menu-btn').addEventListener('click', () => {
      hide(backdrop)
      hide(modal)
      location.reload()
   })
}