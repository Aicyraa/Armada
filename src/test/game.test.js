import Player from '../scripts/player.js'
import Gameboard from '../scripts/gameboard.js'
import Ship from '../scripts/ship.js'

// Ship Class
describe('Ship class public methods', () => {
   const cruiser = new Ship(new Gameboard(), {
      length: 4,
      x: 1,
      y: 1,
      isVertical: false,
   })

   beforeEach(() => {
      cruiser.hits = 0
   })

   it('Check if ship is not sunk', () => {
      cruiser.hit()
      expect(cruiser.isSunk()).toBeFalsy()
   })

   it('Check if ship is sunk', () => {
      cruiser.hit()
      cruiser.hit()
      cruiser.hit()
      cruiser.hit()
      expect(cruiser.isSunk()).toBeTruthy()
   })
})

// Gameboard Class
describe('Gameboard class public methods', () => {
   let gameboard
   beforeEach(() => {
      gameboard = new Gameboard()
   })

   it('Check setShip (Horizontal Expand)', () => {
      const ship = new Ship(gameboard, {
         length: 2,
         x: 1,
         y: 1,
         isVertical: false,
      })
      expect(gameboard.board).toEqual([
         [0, 0, 0, 0, 0],
         [0, ship, ship, 0, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
      ])
   })

   it('Check setShip (Vertical Expand)', () => {
      const ship = new Ship(gameboard, {
         length: 3,
         x: 3,
         y: 3,
         isVertical: true,
      })
      expect(gameboard.board).toEqual([
         [0, 0, 0, 0, 0],
         [0, 0, 0, ship, 0],
         [0, 0, 0, ship, 0],
         [0, 0, 0, ship, 0],
         [0, 0, 0, 0, 0],
      ])
   })

   it('Ship setup cancel if coordinates exceeds 10x10', () => {
      const ship = new Ship(gameboard, {
         length: 2,
         x: 1,
         y: 4,
         isVertical: false,
      })

      expect(gameboard.board).toEqual([
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
      ])
   })

   it('Ship setup cancel if cell is occupied', () => {
      const ship1 = new Ship(gameboard, {
         length: 2,
         x: 1,
         y: 2,
         isVertical: false,
      })
      const ship2 = new Ship(gameboard, {
         length: 3,
         x: 3,
         y: 3,
         isVertical: true,
      })

      expect(gameboard.board).toEqual([
         [0, 0, 0, 0, 0],
         [0, 0, ship1, ship1, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0],
      ])
   })

   it('receiveAtk returns false if the attack hits an empty cell', () => {
      new Ship(gameboard, { length: 3, x: 1, y: 1, isVertical: false })
      expect(gameboard.receiveAtk(2, 2)).toEqual({ c: '#f5f2f2', hit: false })
   })

   it('receiveAtk returns true if it hit a ship ', () => {
      new Ship(gameboard, { length: 3, x: 1, y: 1, isVertical: false })
      expect(gameboard.receiveAtk(1, 2)).toEqual({ c: '#f97575', hit: true })
   })

   it('receiveAtk returns nothing if same position it shot ', () => {
      new Ship(gameboard, { length: 3, x: 1, y: 1, isVertical: false })
      gameboard.receiveAtk(1, 2)
      expect(gameboard.receiveAtk(1, 2)).toBeUndefined()
   })

   it('isSunk returns true if receiveAtk works well', () => {
      const ship = new Ship(gameboard, {
         length: 2,
         x: 1,
         y: 1,
         isVertical: false,
      })
      gameboard.receiveAtk(1, 1)
      gameboard.receiveAtk(1, 2)
      expect(ship.isSunk()).toBeTruthy()
   })

   it('areAllShipsSunk returns false when ships are not sunk', () => {
      const ship = new Ship(gameboard, {
         length: 2,
         x: 1,
         y: 1,
         isVertical: false,
      })

      gameboard.receiveAtk(1, 1)
      expect(gameboard.areAllShipsSunk()).toBeFalsy()
   })

   it('areAllShipsSunk returns true when there is no ship left', () => {
      const ship = new Ship(gameboard, {
         length: 2,
         x: 1,
         y: 1,
         isVertical: false,
      })

      gameboard.receiveAtk(1, 1)
      gameboard.receiveAtk(1, 2)
      expect(gameboard.areAllShipsSunk()).toBeTruthy()
   })

})

// Player Class
describe('Player class testing', () => {
   it('Check player board', () => {
      const gameboard = new Gameboard()
      const me = new Player(gameboard, 'Jee', true)

      const ship1 = new Ship(gameboard, {
         length: 2,
         x: 1,
         y: 1,
         isVertical: false,
      })
      const ship2 = new Ship(gameboard, {
         length: 3,
         x: 3,
         y: 3,
         isVertical: true,
      })

      expect(me.gameboard.board).toEqual([
         [0, 0, 0, 0, 0],
         [0, ship1, ship1, ship2, 0],
         [0, 0, 0, ship2, 0],
         [0, 0, 0, ship2, 0],
         [0, 0, 0, 0, 0],
      ])
   })
})
