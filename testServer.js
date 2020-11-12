var db = require('./db');
var express = require('express');


function checkUserInRooms(userId){
	for(var i=0;i<game.room.length;i++){
		for(var j=0;j<game.room[i].players.length;j++){
			if(game.room[i].players[j].userId==userId){
				return i;
			}
		}
	}
	return -1;
}

function httpServer(){
	var userAPI = express();
	userAPI.get('/util', function(req, res){
		res.set({'Access-Control-Allow-Origin':'*'});//'http://45.32.47.119'});	
		switch(req.query.action){
			case 'register': 
				db.register_user(req.query.id, req.query.password).then(result=>{
					return res.send(result);
					
				});
				break;
			
			case 'login':
				db.check_user(req.query.id, req.query.password).then(result=>{
                                        return res.send(result);
                                	
				});
                                break;
			
			case 'updatePassword':
				db.update_password(req.query.id, req.query.oldPassword, req.query.newPassword).then(result=>{
                                        return res.send(result);
					
                                });
                                break;
			
			case 'adminXinyue':
				db.admin_check_users().then(result=>{
                                        return res.send(result);
                                	
				});
                                break;

			case 'createRoom':
				db.user_join_room(req.query.userId, req.query.roomId).then(result =>{
					return res.send(result);
				});
				break;

			case 'joinRoom':
				db.user_join_room(req.query.userId, req.query.roomId).then(result =>{
                                        return res.send(result);
                                });
				break;

			case 'searchRooms':
				db.check_rooms().then(result =>{
					return res.send(result);
				});
				break;

			default: return res.send({requestErr : 'wrong params'}); break;
				
		}
		//res.end();
		
	});

	var server = userAPI.listen(9191, function(){
		console.log('api url: http://%s:%s', server.address().address, server.address().port);
	});

}

httpServer();


function ws(){
	const WebSocket = require('ws');

	const server = new WebSocket.Server({ port: 9190 });

	server.on('open', function open() {
  		console.log('server on port 9190');
	});

	server.on('close', function close() {
  		console.log('disconnected');
	});

	
	server.on('connection', function connection(ws, req) {
  		const ip = req.connection.remoteAddress;
  		const port = req.connection.remotePort;
  		const clientName = ip + port;
		console.log(ip+' connected');

	
		
		ws.on('message', function incoming(message) {
			//console.log('received message: '+message+' from '+ip);
			
			var resData='';

			var reqJson = JSON.parse(message).data;
			

				ws.groupId = reqJson.roomId

				resData = {
					userId : reqJson.userId,
					position_x : reqJson.position_x,
					position_y : reqJson.position_y
				}	
				

			
			server.clients.forEach(function each(client) {
      				//console.log(client);
				if (client.readyState === WebSocket.OPEN&&client.groupId==reqJson.roomId) {
					//console.log(game);
          				//var str = 'test server 9190 received: '+message;
              				client.send(JSON.stringify(resData));
				}
    			});
		});
	});
}

ws();



