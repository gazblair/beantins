const request = require('request')
const util = require('util')
const WebSocket = require('ws');
const logger = require('../test/logger');
let webSocket = null
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
      webSocket = new WebSocket(chatUrlRoot + "?userId=1234")

      webSocket.onopen = (e) => {
      console.log("Websocket opened")
      //webSocket.send("{\"action\":\"sendmessage\", \"data\":\"hello world\"}")
      resolve()
      }
      
      webSocket.onerror = (error) => { 
        console.log("Websocket error")    
      reject(error)
      }
      
      webSocket.onmessage = (e) => {
      console.log("Websocket message received")
      //console.log(JSON.stringify(e, getCircularReplacer()))
      const data = JSON.parse(e.data)
      
      console.log("Origin message: " + data.receive)

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

function logoffUser(userId) {

  try {
    if (webSocket != null)
    {
      webSocket.close()
    }
  }
  catch (error) {
     console.log("websocket failed to close")
  }

}

module.exports = { loginUser, logoffUser };
