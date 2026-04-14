export default class Player {
   constructor(gameboard, name, isPlayer = false) {
      this.gameboard = gameboard.board
      this.name = name
      this.type = isPlayer ? 'player' : 'computer'
   }
}
