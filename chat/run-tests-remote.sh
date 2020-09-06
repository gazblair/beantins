export CHAT_URL_ROOT=wss://jff2npt7zc.execute-api.us-east-1.amazonaws.com/Prod
export SAM_TEMPLATE_FILE=chat.yaml
export SAM_STACK_NAME=BeanTinsChat
export TEST_MODE=remote

./node_modules/cucumber/bin/cucumber-js
