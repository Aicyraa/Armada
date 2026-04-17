import Gameboard from "./gameboard"
import Ship from "./ship"
import Player from "./player"

export default class Controller {
   /* 
      Functions:
      This class is instantiate when the player pressed start
      * init -> Initializes the players and their respective gameboard
      * manageShips -> Make the 2 players set their ship 
      * manageRound -> Start ng battle. 
         * This function loops like this. ( Shoot, check ships, switch ) Then repeat  
      * notifyPlayer -> A methods that choose a random text (arr) when the players shot 
         * Seperate arrays for hit shot and missed shot  
      *   
   */

   constructor() {
      this.human = null
      this.computer = null
      this.currentPlayer = null
      this.winner = null
   }  

   #manageShips() {
      
   }

   #switchPlayer() {
      
   }

   init() {
      const GBS = [new Gameboard(), new Gameboard()]
      this.human = new Player(GBS[0], 'Jee', true)
      this.computer = new Player(GBS[1], 'Tyler')
      this.#manageShips()
   }

   start() {
      
   }

}