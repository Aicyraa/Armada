export default class Player {
   constructor(gameboard, name, isPlayer = false) {
      this.gameboard = gameboard
      this.name = name
      this.type = isPlayer ? 'human' : 'computer'
   }
}
