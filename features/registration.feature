Feature: User registration

Scenario: Unregistered user can successfully register

Given I am not registered
When I enter my name as Johab
And I enter my phone as 01921 563 192
And I register as a new user
Then I receive a 201 response code

Scenario: User cannot register without a phone number

Given I am not registered
When I enter my name as Johab
And I register as a new user
Then I receive a 400 response code
And I receive a message that my phone number is missing
