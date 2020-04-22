# debugParam=$1

# debugPort="5858"
# debugEnabled=false

# if [ "$debugParam" == "--debug" ]; then
#    debugEnabled=true
# fi

export LAMBDA_URL_ROOT=http://127.0.0.1:3000/
export DYNAMODB_ENDPOINT=http://127.0.0.1:8000/

./node_modules/cucumber/bin/cucumber-js --world-parameters {\"mode\":\"local\"}
