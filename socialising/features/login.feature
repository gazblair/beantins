Feature: User login

Scenario: Unregistered user cannot login

Given I am not registered
When I attempt to login
Then I receive a 403 response code

Scenario: Registered user can login

Given I am registered
When I attempt to login
Then I receive a 200 response code
And I am online

