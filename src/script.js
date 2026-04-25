import './style.css'
import Controller from './scripts/controller.js'
import Gameboard from './scripts/gameboard.js'
import Ship from './scripts/ship.js'
import { hide, unhide, renderOwnBoard, renderEnemyBoard, attackCell } from './helpers/ui.helpers.js'
import { isPosEmpty, isPosValid, generatePos } from './helpers/logic.helper.js'
import { playBackgroundMusic, toggleMute, playSound } from './helpers/audio.helper.js'

let gameboard
let controller
let gameOver = false

;(function () {
   document.querySelector('#start-btn').addEventListener('click', initGame)
})()

function initGame() {
   const front = document.querySelector('.front-layer')
   const deploy = document.querySelector('.deployment-layer')

   gameOver = false

   gameboard = new Gameboard()
   const board = renderOwnBoard(gameboard)
   const isVerticalRef = { current: false }
   const shipHandler = initShips(isVerticalRef)

   board.addEventListener('click', (e) => {
      const cell = e.target.closest('.cell')
      if (!cell || cell.classList.contains('ship')) return
      document.querySelectorAll('.cell.marked').forEach(c => c.classList.remove('marked'))
      cell.classList.add('marked')
   })

   const layer = document.querySelector('.deployment-layer')
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
      board.querySelectorAll('.highlight').forEach(c => c.classList.remove('highlight'))
   }, true)

   board.addEventListener('dragover', (e) => {
      const cell = e.target.closest('.cell')
      if (!cell) return
      e.preventDefault()

      board.querySelectorAll('.highlight').forEach(c => c.classList.remove('highlight'))
      const length = parseInt(document.querySelector('.dragging')?.dataset?.length) || 2
      const startX = parseInt(cell.dataset.row)
      const startY = parseInt(cell.dataset.col)

      for (let i = 0; i < length; i++) {
         const x = isVerticalRef.current ? startX + i : startX
         const y = isVerticalRef.current ? startY : startY + i
         const targetCell = board.querySelector(`[data-row="${x}"][data-col="${y}"]`)
         targetCell?.classList.add('highlight')
      }
   }, true)

   board.addEventListener('drop', (e) => {
      const cell = e.target.closest('.cell')
      if (!cell) return
      e.preventDefault()

      const startX = parseInt(cell.dataset.row)
      const startY = parseInt(cell.dataset.col)
      const id = e.dataTransfer.getData('text/plain')
      const length = parseInt(e.dataTransfer.getData('ship/length'))

      if (!id || !length) return

      if (shipHandler.canPlace(length, startX, startY)) {
         const positions = shipHandler.placeShip(id, length, startX, startY)
         positions.forEach((pos, i) => {
            const targetCell = board.querySelector(`[data-row="${pos[0]}"][data-col="${pos[1]}"]`)
            if (!targetCell) return
            targetCell.classList.add('ship')
            targetCell.dataset.shipId = id
            if (isVerticalRef.current) targetCell.classList.add('vertical')
            const span = document.createElement('span')
            span.className = 'blocks'
            span.dataset.shipId = id
            span.dataset.part = i
            targetCell.appendChild(span)
         })
         layer.querySelector(`#${id}`)?.remove()
         board.querySelectorAll('.highlight').forEach(c => c.classList.remove('highlight'))
      }
   }, true)

   document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r') isVerticalRef.current = !isVerticalRef.current
   })

   hide(front)
   unhide(deploy)
   deploy.querySelector('.board-container').append(board)

   document.querySelector('#continue').addEventListener('click', initBattle)
}

function initShips(isVerticalRef) {
   return {
      canPlace: (length, x, y) => {
         const positions = generatePos(length, x, y, isVerticalRef.current)
         return isPosValid(positions) && isPosEmpty(gameboard.board, positions)
      },
      placeShip: (id, length, x, y) => {
         const positions = generatePos(length, x, y, isVerticalRef.current)
         const ship = new Ship(gameboard, length, positions)
         ship.id = id
         return positions
      }
   }
}

function initBattle() {
   const deploy = document.querySelector('.deployment-layer')
   const battle = document.querySelector('.battle-layer')

   const nameInput = deploy.querySelector('#name')
   const nameError = deploy.querySelector('.name-error')
   const name = nameInput.value.trim()

   if (name.length < 2 || name.length > 20) {
      nameInput.classList.add('invalid')
      nameError.classList.remove('hide')
      return
   }

   nameInput.classList.remove('invalid')
   nameError.classList.add('hide')
   controller = new Controller()
   controller.init(gameboard, name)
   gameOver = false

   battle.querySelector('#player-name').textContent = controller.human.name
   battle.querySelector('#computer-name').textContent = controller.computer.name

   hide(deploy)
   unhide(battle)

   playBackgroundMusic()

   document.querySelector('#mute-btn').addEventListener('click', toggleMute)

   initArena()
}

function initArena() {
   const battle = document.querySelector('.battle-layer')

   const playerBoard = renderOwnBoard(gameboard)
   const enemyBoard = renderEnemyBoard()

   playerBoard.classList.add('board')
   enemyBoard.classList.add('board')

   enemyBoard.addEventListener('click', (e) => {
      if (gameOver) return
      playSound('fire_shot')
      const result = attackCell(e, controller.computer.gameboard)
      if (result) {
         playSound(result.hit ? 'shot_hit' : 'shot_miss')
         if (controller.computer.gameboard.areAllShipsSunk()) {
            gameOver = true
            alert(`${controller.human.name} wins!`)
            return
         }
         setTimeout(computerTurn, 500)
      }
   })

   battle.querySelector('.player-area').append(playerBoard)
   battle.querySelector('.enemy-area').append(enemyBoard)
}

function computerTurn() {
   if (gameOver) return
   const coords = controller.computer.getAtkCoords()
   if (!coords) return

   const [x, y] = coords
   const result = controller.human.gameboard.receiveAtk(x, y)
   controller.computer.recordAttackResult(x, y, result.hit)

   const playerBoard = document.querySelector('.player-area .board')
   const cell = playerBoard.querySelector(`[data-row="${x}"][data-col="${y}"]`)
   if (cell) {
      if (result.hit) {
         cell.classList.add('hit')
         cell.style.backgroundColor = '#f97575'
         playSound('shot_hit')
      } else {
         cell.classList.add('miss')
         cell.style.backgroundColor = '#f5f2f2'
         const span = document.createElement('span')
         span.className = 'blocks'
         cell.appendChild(span)
         playSound('shot_miss')
      }
   }

   if (controller.human.gameboard.areAllShipsSunk()) {
      gameOver = true
      alert(`${controller.computer.name} wins!`)
   }
}
