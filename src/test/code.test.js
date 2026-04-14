import Player from '../scripts/player.js'
import Gameboard from '../scripts/gameboard.js'
import Ship from '../scripts/ship.js'

describe('Ship class public methods', () => {
   const cruiser = new Ship(new Gameboard(), { length: 2, x: 1, y: 1, isVertical: false })

   beforeEach(() => {
      cruiser.hits = 0
   })

   it.skip('Check if ship is not sunk', () => {
      cruiser.hit()
      expect(cruiser.isSunk()).toBeFalsy()
   })

   it.skip('Check if ship is sunk', () => {
      cruiser.hit()
      cruiser.hit()
      cruiser.hit()
      cruiser.hit()
      expect(cruiser.isSunk()).toBeTruthy()
   })
})

describe('Gameboard class public methods', () => {
   let gameboard
   beforeEach(() => {
      gameboard = new Gameboard()
   })

   it.skip('Check setShip (Horizontal Expand)', () => {
      new Ship(gameboard, {
         length: 2,
         x: 1,
         y: 1,
         isVertical: false,
      })
      expect(gameboard.board).toEqual([
         [0, 0, 0, 0, 0],
         [0, 1, 1, 0, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
      ])
   })

   it.skip('Check setShip (Vertical Expand)', () => {
      new Ship(gameboard, { length: 3, x: 3, y: 3, isVertical: true })
      expect(gameboard.board).toEqual([
         [0, 0, 0, 0, 0],
         [0, 0, 0, 1, 0],
         [0, 0, 0, 1, 0],
         [0, 0, 0, 1, 0],
         [0, 0, 0, 0, 0],
      ])
   })
})

describe('Player class testing', () => {
   it('Check player board', () => {
      const gameboard = new Gameboard()
      const me = new Player(gameboard, 'Jee', true)

      new Ship(gameboard, { length: 2, x: 1, y: 1, isVertical: false })
      new Ship(gameboard, { length: 3, x: 3, y: 3, isVertical: true })
      console.log(me.gameboard);
      
      expect(me.gameboard).toEqual([
         [0, 0, 0, 0, 0],
         [0, 1, 1, 1, 0],
         [0, 0, 0, 1, 0],
         [0, 0, 0, 1, 0],
         [0, 0, 0, 0, 0],
      ])
   })
})
