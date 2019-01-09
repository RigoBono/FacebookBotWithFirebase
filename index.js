const functions = require('firebase-functions'); //This is the dependency for link with the platform of firebase
const req=require('request');


/**This is the hello world of Firebase, it will respond with the helloWorld endpoint in your browser**/
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase YOUR_NAME_HERE!");
});


/**
In the same function, the domain ownership validation (hub.challenge) that arrives through parameters is done through the first facebook event
**/
exports.fbBot = functions.https.onRequest( (request,response) => {
	//response.send(request.query['hub.challenge']);
	request.body.entry.forEach(
    	function(entry){
			entry.messaging.forEach(
				function(event){
					processEvent(event);
				}
			);
		}
	);
	response.sendStatus(200);
});




/**
Function to obtain from the event the parameters of the id of the user that is the recipient of the message and the text that is sent, to process and return to Facebook through the function sendResponseToFB
**/
function processEvent(event){
  if(event.message){
    let senderID=event.sender.id;
  	let message=event.message;

  	if(message.text){
  		var response={
  			"text":'Sorry Dave, i can not do -> '+message.text
  		}
  		sendResponseToFB(senderID,response);
  	}

  }

}


/**
Function to give structure to the body of the message, and send the request to Facbook
**/

function sendResponseToFB(senderID,response){

	let request_body = {
		recipient:{
			id:senderID
		},
		message:response
	}
  console.log("-------");
  console.log(request_body);
  console.log("-------");
	req({
		uri:'https://graph.facebook.com/v2.6/me/messages',
		qs:{access_token:'YOUR-TOKEN-HERE'},
		method:'POST',
		json:request_body
	},(err,res,body)=>{
		if(!err){
			console.log("Message ok");
      console.log(res);
      console.log(body);
		}else{
			console.log("ALV Dave, there is  a crash");
      console.log(err);
		}
	});
}
