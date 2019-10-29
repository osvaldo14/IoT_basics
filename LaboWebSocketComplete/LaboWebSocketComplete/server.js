var http = require('http')
var WebSocketServer = require('websocket').server
var fs = require('fs')
var PORT = 18000
var server = http.createServer(function(request, response) {
	var responsePage
	switch(request.url){
		case '/':
			response.writeHead(200, {'Content-Type': 'text/html'});
			responsePage = fs.readFileSync('index.html')
		break;
		case '/client.js':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			responsePage = fs.readFileSync('client.js')
		break;
		case '/Chart.js':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			responsePage = fs.readFileSync('Chart.js')
		break;
		case '/jquery.min.js':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			responsePage = fs.readFileSync('jquery.min.js')
		break;
		//404 Not found
		default:
			response.writeHead(404, {'Content-Type': 'text/html'});
			responsePage = '<html><head><meta charset="utf-8"><title>Oops !</title></head><body>L\'url demandée n\'existe pas.</body>'
		break;
	}
	response.end(responsePage);
})
server.listen(PORT, function() {
	console.log("Server listening on port "+PORT)
})


// create the server
wsServer = new WebSocketServer({
    httpServer: server
})


var clients = []
var count = 0
PACKET_TYPE = {
	"LastMeasure" : 0,
	"Average" : 1,
	"2Dates" : 2,
	"Hello"	: 3
}


var connection;
wsServer.on('request', function(request) {
    connection = request.accept(null, request.origin)
 
    var id = count++							//id is the number of the new client 
	clients[id] = {"con" : connection, "pos" : null, "name" : null}	//Configure the new client
	console.log("New connection : "+id)


    connection.on('message', function(message) {			//When receiving a message
		if(message.type == 'utf8')
			message = JSON.parse(message.utf8Data);
		else
			return

		switch(message.type){
			case PACKET_TYPE["Hello"]:
				//Send hello packet to inform the client that connection was succesfull
				var packet = {
					"type" : PACKET_TYPE["Hello"],
					"data" : {
						"id" : id
					}
				}
				connection.sendUTF(JSON.stringify(packet))
			break
			/*case PACKET_TYPE["LastMeasure"]:
				get_last_measure(message.data.controllerID, message.data.sensorID);
			break
			case PACKET_TYPE["Average"]:
				get_average(message.data.roomID, message.data.number);
			break
			case PACKET_TYPE["2Dates"]:
				get_2dates(message.data.controllerID, message.data.sensorID, message.data.date1, message.data.date2);
			break
			default:
			break*/

		}//*/
    })

    connection.on('close', function(connection) {
		console.log("Connection closed : "+id)
		delete clients[id]
		var packet = {
			"type": PACKET_TYPE["ClientLeft"],
			"data" : {
				"id" : id
			}
		}
		//clients.con.sendUTF(JSON.stringify(packet));
    })
})


const mysql = require('mysql');

let conn	= mysql.createConnection({
	host : "172.20.8.239",
	user : "root",
	password : "lama123",
	database : "SDI_IoT"
});


function get_last_measure(controllerID, sensorID){
	let query = 'SELECT * FROM sensors WHERE number ="' + sensorID + '"AND raspberry ="' + controllerID +'" ORDER BY updateTime DESC LIMIT 20';
	conn.query(query, function(err, result){
		if(err) throw err;
		let lastM_packet = {
			"type" : PACKET_TYPE["LastMeasure"],
			"data" : {"result" : result}
		}
		clients.forEach(function(client){
			client.con.sendUTF(JSON.stringify(lastM_packet))
        });
	});
}

//270000 peut être changer pour voir les updates plus vite.
setInterval(function(){
    get_last_measure(2,3);
}, 2000);


/*function get_average(roomID, number){
	let query = 'SELECT AVG(battery) FROM sensors WHERE room = "' + roomID + '" LIMIT  ' + number + '';
	console.log(query)
	conn.query(query, function(err, result){
		if(err) throw err;
		let Avg1_packet = {
			"type" : PACKET_TYPE["Average"],
			"data" : {"result" : result}
		}
		connection.sendUTF(JSON.stringify(Avg1_packet))
	});

	let query1 = 'SELECT AVG(luminance) FROM sensors WHERE room = "' + roomID + '" LIMIT  ' + number + '';
	conn.query(query1, function(err, result){
		if(err) throw err;
		let Avg2_packet = {
			"type" : PACKET_TYPE["Average"],
			"data" : {"result" : result}
		}
		connection.sendUTF(JSON.stringify(Avg2_packet))
	});

	let query2 = 'SELECT AVG(humidity) FROM sensors WHERE room = "' + roomID + '" LIMIT  ' + number + '';
	conn.query(query2, function(err, result){
		if(err) throw err;
		let Avg3_packet = {
			"type" : PACKET_TYPE["Average"],
			"data" : {"result" : result}
		}
		connection.sendUTF(JSON.stringify(Avg3_packet))
	});

	let query3 = 'SELECT AVG(temperature) FROM sensors WHERE room = "' + roomID + '" LIMIT  ' + number + '';
	conn.query(query3, function(err, result){
		if(err) throw err;
		let Avg4_packet = {
			"type" : PACKET_TYPE["Average"],
			"data" : {"result" : result}
		}
		connection.sendUTF(JSON.stringify(Avg4_packet))
	});
}


function get_2dates(controllerID, sensorID, date1, date2){
	let query = 'SELECT * FROM sensors WHERE number ="' + sensorID + '" AND raspberry ="' + 
        controllerID + '" AND updateTime >="' + date1 + '" AND updateTime <= "' + date2 + '" ORDER BY updateTime DESC';
	console.log(query);
	conn.query(query, function(err, result){
		if(err) throw err;
		let twoDates_packet = {
			"type" : PACKET_TYPE["2Dates"],
			"data" : {"result" : result}
		}
		connection.sendUTF(JSON.stringify(twoDates_packet))
	});

}*/






