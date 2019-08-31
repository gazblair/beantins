const { setWorldConstructor } = require('cucumber')

class CustomWorld {
  constructor() {
    this.variable = 0
  }
  
  setResponseTo(number) {
    this.variable = number
  }

}

setWorldConstructor(CustomWorld)