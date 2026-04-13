export default class Ships {
   constructor(length) {
      this.length = length
      this.hits = 0
   }

   hit() {
      this.hits += 1
   }

   isSunk() {
      return this.length === this.hits ? true : false
   }
}
