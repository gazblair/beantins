export REGISTRATION_URL_ROOT=https://cvxhx7rn7h.execute-api.us-east-1.amazonaws.com/Dev/ 
export CHAT_URL_ROOT=wss://7smbc7hd42.execute-api.us-east-1.amazonaws.com/Prod
export SAM_TEMPLATE_FILE=registration.yaml
export SAM_STACK_NAME=BeanTinsRegistration
export TEST_MODE=remote

./node_modules/cucumber/bin/cucumber-js
