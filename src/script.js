// import './style.css'
import Gameboard from './scripts/gameboard.js'
import Ship from './scripts/ship.js'

const gameboard = new Gameboard()
const ship = new Ship(gameboard, { length: 2, x: 1, y: 1, isVertical: false })

/*    
   === Game flow
   (1) Initialize Gameboard for both players -> (2) Set ships -> (3) Start Game ->
   (4) Player Fire -> (5) Gameboard (Computer) check if an entity is hit ->
   (5) Computer Fire -> Gameboard (Player) check if an entity is hit ->
   (6) Checks if either of the gameboard has no ships ? No, go back to (4) : Yes, game exit  

   === Process 
   (1) Initialize Gameboard -> (2) Sets ships

   === Added Functionalities
   Message Hit / Missed Notification for both ally and enemy (when firing)
   Pefect AI
   Image Ships
   Moving Water?
   2 Player Mode
*/

console.log(new Array(5).fill(new Array(5)).forEach(row => row.fill(0)))
