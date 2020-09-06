if [ "$1" == "--debug" ]; then
   echo Enabling debugging...
   export DEBUG_PORT=5858
fi

export REGISTRATION_URL_ROOT=http://127.0.0.1:3000/
export CHAT_URL_ROOT=http://127.0.0.1:3000/
export DYNAMODB_ENDPOINT=http://127.0.0.1:8000/
export TEST_MODE=local

./node_modules/cucumber/bin/cucumber-js
