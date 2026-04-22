import './style.css'
import DOM from './scripts/dom.js'
import Controller from './scripts/controller.js'
import Gameboard from './scripts/gameboard.js'
import Ship from './scripts/ship.js'
import { hide, unhide, renderBoard, markCell, attachDrag } from './helpers/ui.helpers.js'
import { isPosEmpty, isPosValid, generatePos } from './helpers/logic.helper.js'

;(function () {
   document.querySelector('#start-btn').addEventListener('click', initGame)
   document.querySelector('#continue').addEventListener('click', initBattle)
})()

function initGame() {
   const front = document.querySelector('.front-layer')
   const deploy = document.querySelector('.deployment-layer')

   const gameboard = new Gameboard()
   const board = renderBoard()
   const isVerticalRef = { current: false }
   const shipHandler = initShips(gameboard, isVerticalRef)

   board.addEventListener('click', markCell)
   attachDrag(board, shipHandler, isVerticalRef)

   hide(front)
   unhide(deploy)
   deploy.querySelector('.board-container').append(board)
}

function initShips(gameboard, isVerticalRef) {
   return {
      canPlace: (length, x, y) => {
         const positions = generatePos(length, x, y, isVerticalRef.current)
         return isPosValid(positions) && isPosEmpty(gameboard.board, positions)
      },
      placeShip: (id, length, x, y) => {
         const positions = generatePos(length, x, y, isVerticalRef.current)
         gameboard.setShip({ length, hits: 0, id }, positions)
         return positions
      }
   }
}

function initBattle() {
   const front = document.querySelector('.front-layer')
   const deploy = document.querySelector('.deployment-layer')
   const battle = document.querySelector('.battle-layer')

   hide(deploy)
   unhide(battle)
}

function initArena() {}
