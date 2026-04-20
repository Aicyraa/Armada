import './style.css'
import DOM from './scripts/dom.js'
import Controller from './scripts/controller.js'
import Gameboard from './scripts/gameboard.js'
import Ship from './scripts/ship.js'
import { isPosEmpty, isPosValid, generatePos, hide, unhide, renderBoard, markCell, extractCoords } from './helpers/ui.helpers.js'

;(function () {
   document.querySelector('#start-btn').addEventListener('click', initGame)
   document.querySelector('#continue').addEventListener('click', initShips)
})()

function initGame() {
   const front = document.querySelector('.front-layer')
   const deploy = document.querySelector('.deployment-layer')
   const battle = document.querySelector('.battle-layer')

   const board = renderBoard()
   board.addEventListener('click', markCell)

   hide(front)
   unhide(deploy)
   deploy.querySelector('.board-container').append(board)
}

function initShips() {
   // Hindi na need ng own config ng sheeps dito since mang gagaling ang config ng ship sa element na iddrag ni user sa board
   const CONTROLLER = new Controller()
   const GAMEBOARD = new Gameboard()
   const [x, y] = extractCoords()
   // User Click -> get the positoin where the user click
   // -> generate coords -> validate the coordinates using the gameboard variable here
   // -> if passed create a ship element then pass it to the gameboard.setupShip()

   const positions = generatePos(2, x, y, false) // The ship length and direction here is temp
   if (isPosEmpty(GAMEBOARD.board, positions) && isPosValid(positions)) {
      new Ship(GAMEBOARD, 2, positions)
      console.log('Working');
   }
}

function initArena() {

}
