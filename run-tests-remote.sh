export LAMBDA_URL_ROOT=https://eqlfyltr01.execute-api.us-east-1.amazonaws.com/Dev/
export SAM_TEMPLATE_FILE=output.yaml
export SAM_STACK_NAME=messenger
export TEST_MODE=remote

./node_modules/cucumber/bin/cucumber-js
