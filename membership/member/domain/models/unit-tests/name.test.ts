"use strict"

import {Name} from "../name";

test('when name is valid then value can be retrieved', () => {
  let name = new Name("bob@gmail.com")

  expect(name.value).toBe("bob@gmail.com")
})

test('when name is less than 2 characters then report invalid', () => {
  expect(() => {new Name("A")}).toThrow('name too short: A')
})

test('when name is greater than 256 characters then report invalid', () => {
  let veryLongName = "bob".padStart(257, "b");

  expect(() => {new Name(veryLongName)}).toThrow('name cannot exceed 256 characters')
})
