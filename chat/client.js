const request = require('request')
const util = require('util')
const WebSocket = require('ws')

const chatUrlRoot = process.env.CHAT_URL_ROOT
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  

async function loginUserAwait(phone, callback)
{
  return new Promise((resolve, reject) => {
      let webSocket = new WebSocket(chatUrlRoot)

      webSocket.onopen = (e) => {
      console.log(JSON.stringify(e))
      console.log("Opened")
      webSocket.send("{\"action\":\"sendmessage\", \"data\":\"hello world\"}")
      }
      
      webSocket.onerror = (error) => {     
      webSocket.close()
      reject(error)
      }
      
      webSocket.onmessage = (e) => {
      console.log(JSON.stringify(e, getCircularReplacer()))
      const data = JSON.parse(e.data)
      console.log("Origin message: " + data.receive)

      webSocket.close()
      resolve()
      }
  });
}

function parseResponseCodeFromMessage(message)
{
   let separator = message.lastIndexOf(':');

   return parseInt(message.substring(separator + 1));
}

async function loginUser(phone, callback) {
  const httpOK = 200
  const httpForbidden = 403
  let responseCode = httpForbidden

  try {
    await loginUserAwait(phone, callback)
    responseCode = httpOK
  }
  catch (error) {
    responseCode = parseResponseCodeFromMessage(error.message)
  }

  callback(responseCode)
}

module.exports = { loginUser };
