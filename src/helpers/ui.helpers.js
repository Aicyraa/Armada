// UI - Helpers

export function hide(element) {
   element.classList.add('hide')
}

export function unhide(element) {
   element.classList.remove('hide')
}

export function renderBoard() {
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
   const cell = event.target.closest('.cell')
   if (!cell) return
   document.querySelectorAll('.cell.marked').forEach(c => c.classList.remove('marked'))
   cell.classList.add('marked')
}

export function createShipElement(shipId, partIndex) {
   const span = document.createElement('span')
   span.className = 'blocks'
   span.dataset.shipId = shipId
   span.dataset.part = partIndex
   return span
}

export function removeShipFromDock(shipId) {
   document.getElementById(shipId)?.remove()
}

export function attachDrag(board, { canPlace, placeShip }, isVerticalRef) {
   const layer = board.closest('.deployment-layer') || document

   document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r') isVerticalRef.current = !isVerticalRef.current
   })

   layer.addEventListener('dragstart', (e) => {
      const draggable = e.target.closest('.ships')
      if (!draggable) return
      e.dataTransfer.setData('text/plain', draggable.id)
      e.dataTransfer.setData('ship/length', draggable.dataset.length)
      draggable.classList.add('dragging')
   }, true)

   layer.addEventListener('dragend', (e) => {
      const draggable = e.target.closest('.ships')
      draggable?.classList.remove('dragging')
      clearHighlights(board.querySelectorAll('.cell'))
   }, true)

   board.addEventListener('dragover', (e) => {
      const cell = e.target.closest('.cell')
      if (!cell) return
      e.preventDefault()
      highlightCells(cell, isVerticalRef.current, board.querySelectorAll('.cell'))
   }, true)

   board.addEventListener('drop', (e) => {
      const cell = e.target.closest('.cell')
      if (!cell) return
      e.preventDefault()

      const [startX, startY] = cell.id.split('-').map(Number)
      const id = e.dataTransfer.getData('text/plain')
      const length = parseInt(e.dataTransfer.getData('ship/length'))

      if (!id || !length) return

      if (canPlace(length, startX, startY)) {
         const positions = placeShip(id, length, startX, startY)
         renderShipOnBoard(positions, id, isVerticalRef.current, board.querySelectorAll('.cell'))
         const shipEl = layer.querySelector(`#${id}`)
         shipEl?.remove()
      }
   }, true)
}

function renderShipOnBoard(positions, id, isVertical, cells) {
   positions.forEach((pos, i) => {
      const cell = document.getElementById(`${pos[0]}-${pos[1]}`)
      if (!cell) return
      cell.classList.add('ship')
      if (isVertical) cell.classList.add('vertical')
      cell.appendChild(createShipElement(id, i))
   })
}

function highlightCells(targetCell, isVertical, cells) {
   clearHighlights(cells)
   const dragging = document.querySelector('.dragging')
   const length = parseInt(dragging?.dataset?.length) || 2
   const [startX, startY] = targetCell.id.split('-').map(Number)

   for (let i = 0; i < length; i++) {
      const x = isVertical ? startX + i : startX
      const y = isVertical ? startY : startY + i
      document.getElementById(`${x}-${y}`)?.classList.add('highlight')
   }
}

function clearHighlights(cells) {
   cells.forEach(c => c.classList.remove('highlight'))
}