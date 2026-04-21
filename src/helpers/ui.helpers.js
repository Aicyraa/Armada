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
   document.querySelectorAll('.cell').forEach(c => (c.className = 'cell'))
   const cell = event.target
   cell.classList.add('marked')
}

export function extractCoords() {
   const cell = document.querySelector('.marked')
   return cell.id.split('-').map(c => parseInt(c))
}

// Drag and Drop

export function attachDrag() {
   const draggable = document.querySelectorAll('.ships')
   const dropzone = document.querySelectorAll('.cell')

   draggable.forEach(node => {
      node.addEventListener('dragstart', (e) => {
         e.dataTransfer.setData('text/plain', e.target.id)
         console.log('dragging');
         node.classList.add('dragging')
      })

      node.addEventListener('dragend', (e) => {
         node.classList.remove('dragging')
         console.log('dropped');
         
      })
   })

   dropzone.forEach(node => {
      node.addEventListener('dragover', (e) => {
         e.preventDefault()
      })

      node.addEventListener('drop', (e) => {
         e.preventDefault()
      
         const id = e.dataTransfer.getData('text/plain')
         const draggedElement = document.getElementById(id)
      
         e.currentTarget.appendChild(draggedElement)
      
         console.log('dropped on dropzone')
      })
   })
}