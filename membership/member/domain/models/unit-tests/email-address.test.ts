"use strict"

import {EmailAddress} from "../email-address";

test('when email is valid then value can be retrieved', () => {
  let email = new EmailAddress("bob@gmail.com")

  expect(email.value).toBe("bob@gmail.com")
})

test('when email contains whitespace then report invalid', () => {
  expect(() => {new EmailAddress("bob smith@gmail.com")}).toThrow('invalid email format: bob smith@gmail.com')
})

test('when email is missing domain then report invalid', () => {
  expect(() => {new EmailAddress("bob@")}).toThrow('invalid email format: bob@')
})

test('when email is missing recipient then report invalid', () => {
  expect(() => {new EmailAddress("@gmail.com")}).toThrow('invalid email format: @gmail.com')
})

test('when email has extra @ sign then report invalid', () => {
  expect(() => {new EmailAddress("bob@@gmail.com")}).toThrow('invalid email format: bob@@gmail.com')
})

test('when email is greater than 256 characters then report invalid', () => {
  let veryLongEmail = "bob@gmail.com".padStart(257, "b");

  expect(() => {new EmailAddress(veryLongEmail)}).toThrow('email cannot exceed 256 characters')
})
