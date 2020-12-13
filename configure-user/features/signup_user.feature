Feature: User signup

Scenario: Unregistered user can successfully sign up

Given I am not registered
When I enter my name as Johab
And I enter my phone as 01921 563 192
And I register as a new user
Then I receive a 201 response code

Scenario: User cannot sign up without a phone number

Given I am not registered
When I enter my name as Johab
And I register as a new user
Then I receive a 400 response code
And I receive a message that my phone number is missing

Scenario: User cannot sign up without a name

Given I am not registered
When I enter my phone as 01921 563 192
And I register as a new user
Then I receive a 400 response code
And I receive a message that my name is missing

Scenario: User cannot sign up with a registered phone number

Given I have already registered as Dave and my phone number is 01452 126 665
When I enter my name as Bobskeng
And I enter my phone as 01452 126 665
And I register as a new user
Then I receive a 409 response code
And I receive a message that my account already exists