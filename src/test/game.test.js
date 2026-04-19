import Player from '../scripts/player.js'
import Controller from '../scripts/controller.js'
import Gameboard from '../scripts/gameboard.js'
import Ship from '../scripts/ship.js'
import Computer from '../scripts/computer.js'

// Ship Class
describe('Ship class public methods', () => {
   let gameboard
   let ship

   beforeEach(() => {
      gameboard = new Gameboard()
      ship = new Ship(gameboard, 4, [
         [1, 1],
         [1, 2],
         [1, 3],
         [1, 4],
      ])
   })

   it('Check if ship is not sunk', () => {
      ship.hit()
      expect(ship.isSunk()).toBeFalsy()
   })

   it('Check if ship is sunk', () => {
      ship.hit()
      ship.hit()
      ship.hit()
      ship.hit()
      expect(ship.isSunk()).toBeTruthy()
   })
})

// Gameboard Class
describe('Gameboard class public methods', () => {
   let gameboard

   beforeEach(() => {
      gameboard = new Gameboard()
   })

   it('Check setShip (Horizontal placement)', () => {
      const ship = new Ship(gameboard, 2, [
         [1, 1],
         [1, 2],
      ])
      expect(gameboard.board[1][1]).toBe(ship)
      expect(gameboard.board[1][2]).toBe(ship)
   })

   it('Check setShip (Vertical placement)', () => {
      const ship = new Ship(gameboard, 3, [
         [1, 1],
         [2, 1],
         [3, 1],
      ])
      expect(gameboard.board[1][1]).toBe(ship)
      expect(gameboard.board[2][1]).toBe(ship)
      expect(gameboard.board[3][1]).toBe(ship)
   })

   it('receiveAtk returns miss when attack hits empty cell', () => {
      new Ship(gameboard, 3, [
         [1, 1],
         [1, 2],
         [1, 3],
      ])
      expect(gameboard.receiveAtk(2, 2)).toEqual({
         c: '#f5f2f2',
         hit: false,
      })
   })

   it('receiveAtk returns hit when attack hits a ship', () => {
      new Ship(gameboard, 3, [
         [1, 1],
         [1, 2],
         [1, 3],
      ])
      expect(gameboard.receiveAtk(1, 2)).toEqual({
         c: '#f97575',
         hit: true,
      })
   })

   it('receiveAtk returns undefined when same position is shot again', () => {
      new Ship(gameboard, 3, [
         [1, 1],
         [1, 2],
         [1, 3],
      ])
      gameboard.receiveAtk(1, 2)
      expect(gameboard.receiveAtk(1, 2)).toBeUndefined()
   })

   it('isSunk returns true after receiving enough hits', () => {
      const ship = new Ship(gameboard, 2, [
         [1, 1],
         [1, 2],
      ])
      gameboard.receiveAtk(1, 1)
      gameboard.receiveAtk(1, 2)
      expect(ship.isSunk()).toBeTruthy()
   })

   it('areAllShipsSunk returns false when ships are not sunk', () => {
      new Ship(gameboard, 2, [
         [1, 1],
         [1, 2],
      ])
      gameboard.receiveAtk(1, 1)
      expect(gameboard.areAllShipsSunk()).toBeFalsy()
   })

   it('areAllShipsSunk returns true when all ships are sunk', () => {
      const ship = new Ship(gameboard, 2, [
         [1, 1],
         [1, 2],
      ])
      gameboard.receiveAtk(1, 1)
      gameboard.receiveAtk(1, 2)
      expect(gameboard.areAllShipsSunk()).toBeTruthy()
   })
})

describe('Controller Class', () => {
   it('setComputerShips deployed the computer ships properly', () => {
      const mockPositions = [
         { x: 1, y: 0, direction: false }, // Patrol Boat (length 2)
         { x: 7, y: 0, direction: false }, // Destroyer (length 3)
         { x: 4, y: 0, direction: false }, // Battleship (length 4)
         { x: 8, y: 3, direction: false }, // Patrol Boat (length 2)
         { x: 6, y: 4, direction: false }, // Lifeboat (length 1)
      ]

      const computerGB = new Gameboard()
      const mockComputer = {
         gameboard: computerGB,
         name: 'Tyler',
         getRandomPosition: jest.fn(() => {
            const idx = mockComputer.callIndex || 0
            mockComputer.callIndex = idx + 1
            return mockPositions[idx] || mockPositions[mockPositions.length - 1]
         }),
      }

      const controller = new Controller()
      const humanGB = new Gameboard()
      const human = new Player(humanGB, 'Jee', true)

      // Inject mock computer and human into init()
      controller.init(human, mockComputer)

      const board = mockComputer.gameboard.board

      // Patrol Boat (length 2): starts at [1,0], horizontal -> [1,0], [1,1]
      expect(board[1][0]).toBeInstanceOf(Ship)
      expect(board[1][1]).toBeInstanceOf(Ship)

      // Destroyer (length 3): starts at [7,0], horizontal -> [7,0], [7,1], [7,2]
      expect(board[7][0]).toBeInstanceOf(Ship)
      expect(board[7][1]).toBeInstanceOf(Ship)
      expect(board[7][2]).toBeInstanceOf(Ship)

      // Battleship (length 4): starts at [4,0], horizontal -> [4,0], [4,1], [4,2], [4,3]
      expect(board[4][0]).toBeInstanceOf(Ship)
      expect(board[4][1]).toBeInstanceOf(Ship)
      expect(board[4][2]).toBeInstanceOf(Ship)
      expect(board[4][3]).toBeInstanceOf(Ship)

      // Patrol Boat (length 2): starts at [8,3], horizontal -> [8,3], [8,4]
      expect(board[8][3]).toBeInstanceOf(Ship)
      expect(board[8][4]).toBeInstanceOf(Ship)

      // Lifeboat (length 1): starts at [6,4] -> [6,4]
      expect(board[6][4]).toBeInstanceOf(Ship)
   })
})
