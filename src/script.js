import './style.css'
import Controller from './scripts/controller.js'
import Player from './scripts/player.js'
import Gameboard from './scripts/gameboard.js'
import Ship from './scripts/ship.js'

;(function () {
   const layers = {
      front: document.querySelector('.front-layer'),
      dep: document.querySelector('.deployment-layer'),
      battle: document.querySelector('.battle-layer'),
   }
   
   document.querySelector('#start-btn').addEventListener('click', e => {
      const CONTORLLER = new Controller()
      layers.front.classList.add('hide')
   })
})()
