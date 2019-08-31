Feature: User registration

Scenario: Unregistered user can successfully register

Given I am not registered
When I enter my details and send the register request
Then I receive acknowledgement that my account was created
