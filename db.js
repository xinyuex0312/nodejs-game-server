var mysql = require('mysql');
var config = {
        host : '**',
        user : '**',
        password : '**',
        database : '**',
	multipleStatements : true

};
//var connection = mysql.createConnection();


function handleDisconnect(conn) {
  conn.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    conn = mysql.createConnection(conn.config);
    handleDisconnect(conn);
    conn.connect();
  });
}


var sql = {
	create_table_users: function(){
		return new Promise(resolve =>{
			/*
			if(connection.state == 'disconnected' ) {
				//handleDisconnect(connection);
				connection.connect();
			}
			*/
			var connection = mysql.createConnection(config);
			var query = 'create table if not exists users(id varchar(15), password varchar(20), createTime datetime default current_timestamp, primary key(id))';
			connection.query(query, function(err, res){
				if(err){
					resolve({
						action : 'create_table_users',
						state : 'error',
						desc : err.message
					});
				}
				resolve({
					action : 'create_table_users',
					state : 'succeed',
					desc : res
				});
			});
			connection.end();
			//handleDisconnect(connection);			
		});
	},

	create_table_rooms: function(){
                return new Promise(resolve =>{
                        /*
                        if(connection.state == 'disconnected' ) {
                                //handleDisconnect(connection);
                                connection.connect();
                        }
                        */
                        var connection = mysql.createConnection(config);
                        var query = 'create table if not exists rooms(userId varchar(15), roomId varchar(20), state varchar(10), primary key(userId))';
                        connection.query(query, function(err, res){
                                if(err){
                                        resolve({
                                                action : 'create_table_rooms',
                                                state : 'error',
                                                desc : err.message
                                        });
                                }
                                resolve({
                                        action : 'create_table_rooms',
                                        state : 'succeed',
                                        desc : res
                                });
                        });
                        connection.end();
                        //handleDisconnect(connection);                 
                });
        },

	delete_data_in_users_and_rooms: function(){
		return new Promise(resolve =>{
			var connection = mysql.createConnection(config);
			var query = 'delete from users;delete from rooms';
			connection.query(query, function(err, res){
                                if(err){
                                        resolve({
                                                action : 'delete_data_in_users_and_rooms',
                                                state : 'error',
                                                desc : err.message
                                        });
                                }
                                resolve({
                                        action : 'delete_data_in_users_and_rooms',
                                        state : 'succeed',
                                        desc : res
                                });
                        });
                        connection.end();
		});
	},

	check_user : function(id, password){
		return new Promise( resolve =>{
			/*
			if(connection.state== 'disconnected' ) {
				//handleDisconnect(connection);
				connection.connect();
			}
			*/
			var connection = mysql.createConnection(config);
			var query = 'select * from users where id="'+id+'" and password="'+password+'"';
			connection.query(query, function(err, res){
				if(err){
					resolve({
						action : 'login',
						state : 'error',
						desc : err.message
					});
				}
				if(res.length==0){
					resolve({
						action : 'login',
						state : 'error',
						desc : 'none match'
					});
				}
				else{
					resolve({
						action : 'login',
						state : 'succeed'
					});
				}
				

			});
			connection.end();
			//handleDisconnect(connection);
		});
	},
	
	check_users_in_room : function(userId, roomId){
                return new Promise( resolve =>{
          
                        var connection = mysql.createConnection(config);
                        var query;
			if(userId = "*"){
				query = 'select * from rooms where roomId="'+roomId;
			}
			else{
				query = 'select * from rooms where roomId="'+roomId+'" and userId = "'+userId+'"'; 
			}
			connection.query(query, function(err, res){
                                if(err){
                                        resolve({
                                                action : 'check_users_in_room',
                                                state : 'error',
                                                desc : err.message
                                        });
                                }
                                if(res.length==0){
                                        resolve({
                                                action : 'check_users_in_room',
                                                state : 'error',
                                                desc : 'none match'
                                        });
                                }
                                else{
                                        resolve({
                                                action : 'check_users_in_room',
                                                state : 'succeed',
						data : res
                                        });
                                }


                        });
                        connection.end();
                        //handleDisconnect(connection);
                });
        },

	check_rooms : function(){

                return new Promise( resolve =>{
                        /*
                        if(connection.state == 'disconnected'){
                                connection.connect();
                        }
                        */
                        var connection = mysql.createConnection(config);
                        var query = 'select roomId,count(*) from rooms where roomId is not null group by roomId';
			connection.query(query, function(err, res){
                                if(err){
                                        resolve({
                                                action : 'check_rooms',
                                                state : 'error',
                                                desc : err.message
                                        });
                                }
				resolve({
                                                action : 'check_rooms',
                                                state : 'succeed',
                                                data : res
                                        });
                        });
                        connection.end();
                });
        },

	user_join_room : function(userId, roomId){

                return new Promise( resolve =>{
                        /*
                        if(connection.state == 'disconnected'){
                                connection.connect();
                        }
                        */
                        var connection = mysql.createConnection(config);
			query = 'update rooms set roomId="'+roomId+'", state="alive" where userId="'+userId+'"';
                        connection.query(query, function(err, res){
                        	if(err){
                                	resolve({
                                        	action : 'user_join_room',
                                                state : 'error',
                                                desc : err.message
                                	});
                        	}
				resolve({
                                	action : 'user_join_room',
                                       	state : 'succeed',
                                        roomId : roomId,
					desc : res
                               	});
                        });
                        connection.end();
                });
        },

	update_user_state_in_rooms : function(userId, state){

                return new Promise( resolve =>{
                        /*
                        if(connection.state == 'disconnected'){
                                connection.connect();
                        }
                        */
                        var connection = mysql.createConnection(config);
                        var query = 'update rooms set state="'+state+'" where userId="'+userId+'"';
                        connection.query(query, function(err, res){
                                if(err){
                                        resolve({
                                                action : 'update_user_state_in_rooms',
                                                state : 'error',
                                                desc : err.message
                                        });
                                }
                                if(res.message.includes('Changed: 1')){
                                        resolve({
                                                action : 'update_user_state_in_rooms',
                                                state : 'succeed',
                                                desc : res.message
                                        });
                                }
                                else{
                                        resolve({
                                                action : 'update_user_state_in_rooms',
                                                state : 'error',
                                                desc : 'userId wrong'
                                        });
                                }
                        });
                        connection.end();
                });
        },

	register_user : function(id, password){
		
		return new Promise( resolve =>{
			/*
			if(connection.state == 'disconnected'){
				connection.connect();
			}
			*/
			var connection = mysql.createConnection(config);
			var query = 'insert into users (id, password) values ("'+id+'","'+password+'");insert into rooms(userId,state) values ("'+id+'","alive")';
			connection.query(query, function(err, res){
				if(err){
					resolve({
						action : 'register',
						state : 'error',
						desc : err.message
					});
				}
				resolve({
					action : 'register',
					state : 'succeed',
					desc : res
				});
			});
			connection.end();
		});
	},

	update_password : function(id, oldPassword, newPassword){

                return new Promise( resolve =>{
                        /*
                        if(connection.state == 'disconnected'){
                                connection.connect();
                        }
                        */
                        var connection = mysql.createConnection(config);
                        var query = 'update users set password="'+newPassword+'" where id="'+id+'" and password="'+oldPassword+'"';
                        connection.query(query, function(err, res){
                                if(err){
                                        resolve({
						action : 'update_password',
                                                state : 'error',
                                                desc : err.message
                                        });
                                }
                                if(res.message.includes('Changed: 1')){
					resolve({
						action : 'update_password',
						state : 'succeed',
						desc : res.message
					});
				}
				else{
					resolve({
						action : 'update_password',
                                                state : 'error',
                                                desc : 'old password wrong'
                                        });
				}
                        });
                        connection.end();
                });
        },

	admin_check_users : function(){
                return new Promise( resolve =>{
     
                        var connection = mysql.createConnection(config);
                        var query = 'select * from users';
                        connection.query(query, function(err, res){
                                if(err){
                                        resolve({
						action : 'admin_check_users',
                                                state : 'error',
                                                desc : err.message
                                        });
                                }
                                if(res.length==0){
                                        resolve({
						action : 'admin_check_users',
                                                state : 'error',
                                                desc : 'none match'
                                        });
                                }
                                else{
                                        resolve({
						action : 'admin_check_users',
                                                state : 'succeed',
						result : res
                                        });
                                }


                        });
                        connection.end();
                        //handleDisconnect(connection);
                });
        }
}

module.exports = sql;
