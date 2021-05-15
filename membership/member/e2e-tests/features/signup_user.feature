Feature: Member signup

Scenario: New member can successfully sign up

Given I am not registered
When I enter my name as Johab
And I enter my email as "Johab@gmail.com"
And I signup
Then I receive a 201 response code

Scenario: New member cannot sign up without an email

Given I am not registered
When I enter my name as Johab
And I signup
Then I receive a 400 response code
And I receive the message "cannot signup without an email"

Scenario: New member cannot sign up without a name

Given I am not registered
When I enter my email as "Bob@gmail.com"
And I signup
Then I receive a 400 response code
And I receive the message "cannot signup without a name"

Scenario: Existing member cannot re-sign up

Given I have already signed up as Dave and my email is "Dave@hotmail.com"
When I enter my name as Bobskeng
And I enter my email as "Dave@hotmail.com"
And I signup
Then I receive a 409 response code
And I receive the message "existing member cannot be signed up again"