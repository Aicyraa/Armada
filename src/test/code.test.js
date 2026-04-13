import { experiments } from 'webpack'
import Ships from '../scripts/ships.js'

describe('Ship class public methods', () => {
   const cruiser = new Ships(4)

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

describe('')
