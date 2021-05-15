"use strict"

import {InvalidName} from './invalid-name'

export class Name {
     #name

    constructor(name: string) {

      if (!name)
      {
        throw new InvalidName("name undefined")
      }

      if (name.length < 2)
      {
        throw new InvalidName("name too short: " + name)
      }

      if (name.length > 256)
      {
        throw new InvalidName("name cannot exceed 256 characters")
      }
      
      this.#name = name
    }

    get value() {
      return this.#name
    }
}
