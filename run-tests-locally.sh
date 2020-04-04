debugParam=$1

debugPort="5858"
debugEnabled=false

if [ "$debugParam" == "--debug" ]; then
   debugEnabled=true
fi

if ! [[ $(sudo docker network ls --filter name=local-dev) ]]; then
   sudo docker network create local-dev
fi

mapfile -t outputLines < <(sudo docker ps -a --filter name=local-dynamodb)
if ! [[ ${outputLines[1]} ]]; then
   echo "--- Firing up a fresh dynamodb instance"
   sudo docker run -d --name=local-dynamodb --network local-dev --network-alias=dynamodb -p 8000:8000 amazon/dynamodb-local
else
   echo "--- Restarting dynamodb"
   sudo docker restart local-dynamodb 
fi

aws dynamodb --endpoint-url http://localhost:8000 create-table --table-name Users_Dev \
--attribute-definitions AttributeName=Name,AttributeType=S AttributeName=Phone,AttributeType=S --key-schema AttributeName=Phone,KeyType=HASH AttributeName=Name,KeyType=RANGE \
--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

export LAMBDA_URL_ROOT=http://127.0.0.1:3000/
export DYNAMODB_ENDPOINT=http://127.0.0.1:8000/

lambdaLocalCommand="sudo sam local start-api --docker-network local-dev --env-vars localEnvironment.json"

if [[ "$debugEnabled" == true ]]; then
   lambdaLocalCommand="${lambdaLocalCommand} -d ${debugPort}"
fi

echo "Running: $lambdaLocalCommand"

${lambdaLocalCommand} &
sleep 5
pid=$!

./run-tests.sh

# Shutdown sam local