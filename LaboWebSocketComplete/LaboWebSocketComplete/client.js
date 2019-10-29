
let id = null;
let request_avg = 0;
let average_data = [];

PACKET_TYPE = {
	"LastMeasure" : 0,
	"Average" : 1,
	"2Dates" : 2,
	"Hello"	: 3
}

let connection = null

function init(){
	connection = new WebSocket('ws://'+document.domain+':18000')
		//Communication
		connection.onopen = function () {
			
			var packet = {
				"type" : PACKET_TYPE["Hello"],
				"data" : {}
			}

			connection.send(JSON.stringify(packet))
			
		}

		connection.onmessage = function (message) {
			try {
				var message = JSON.parse(message.data);	
			} catch (e) {
				console.log('Invalid JSON: ', message.data);
				return
			}
			console.log("Received "+ message)

			
			var p = message.data
			if(id == null)			// Le client n'a pas encore de id. Il vient de le recevoir de la part du serveur
				if(message.type == PACKET_TYPE["Hello"])
					id = p.id
					console.log("connection successfull");
					console.log(id)

			if(p.id == id)
				return
			switch(message.type){
				case PACKET_TYPE["LastMeasure"]:
					console.log("packet type passé")
					console.log(p.result[0]);
					display_2dates(p.result)
				break
				/*case PACKET_TYPE["Average"]:
					request_avg += 1;
					if(request_avg == 4){
						average_data.push(p.result)
						display_average(average_data)
						//reinitialisation pour les prochaines requetes
						average_data = [];
						request_avg = 0;
					}else{average_data.push(p.result)}
				break
				case PACKET_TYPE["2Dates"]:
					console.log(p.result);
					display_2dates(p.result);
				break*/
			}
		}
}

//Exemple de requete :
//2
//3
//1544000764
//11544000798
function display_2dates(data){
	var battery_array = [];
    var humidity_array = [];
    var motion_array = [];
    var luminance_array = [];
    var temperature_array = [];
    var date_array = [];

    let i = 0;
    while (i < data.length){
    	battery_array.push(parseFloat(data[i].battery));
    	humidity_array.push(parseFloat(data[i].humidity));
    	motion_array.push(parseFloat(data[i].motion));
    	luminance_array.push(parseFloat(data[i].luminance));
    	temperature_array.push(parseFloat(data[i].temperature));
    	date_array.push(parseFloat(data[i].updateTime));
    	i++;
    }
    console.log(battery_array)
    console.log(humidity_array)
    console.log(motion_array)
    console.log(luminance_array)
    console.log(temperature_array)
    console.log(date_array)

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date_array,
            datasets: [{
                lineTension : 0,
                label: 'Battery %',
                data: battery_array,
                backgroundColor: 'blue',
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
            },{
                lineTension : 0,
                label: 'Humidity values',
                data: humidity_array,
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1,
                fill: false
            },{
                lineTension : 0,
                label: 'Motion values ',
                data: motion_array,
                backgroundColor: 'orange',
                borderColor: 'orange',
                borderWidth: 1,
                fill: false
            },{
                lineTension : 0,
                label: 'Luminance values ',
                data: luminance_array,
                backgroundColor: 'yellow',
                borderColor: 'yellow',
                borderWidth: 1,
                fill: false
            },{
                lineTension : 0,
                label: 'Temperature values',
                data: temperature_array,
                backgroundColor: 'purple',
                borderColor: 'purple',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
            display: true,
            text: 'Dated values'
            },
            tooltips: {
            mode: 'index',
            intersect: false,
            },
            hover: {
            mode: 'nearest',
            intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                    display: true,
                    labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                    display: true,
                    labelString: 'Value'
                    }
                }]
            }
        }
    })
}

/*function last(){
	let controllerID = document.getElementById("last_cID").value;
	let sensorID = document.getElementById("last_sID").value;
	var packet = {
		"type" : PACKET_TYPE["LastMeasure"],
		"data" : {
			"controllerID" : controllerID,
			"sensorID" : sensorID
		}
	}
	connection.send(JSON.stringify(packet))
}

function average(){
	let roomID = document.getElementById("roomID").value;
	let number = document.getElementById("nb").value;
	var packet = {
		"type" : PACKET_TYPE["Average"],
		"data" : {
			"roomID" : roomID,
			"number" : number
		}
	}
	connection.send(JSON.stringify(packet))
}

function two_dates(){
	let controllerID = document.getElementById("2datesCID").value;
	let sensorID = document.getElementById("2datesSID").value;
	let date1 = document.getElementById("d1").value;
	let date2 = document.getElementById("d2").value;
	var packet = {
		"type" : PACKET_TYPE["2Dates"],
		"data" : {
			"controllerID" : controllerID,
			"sensorID" : sensorID,
			"date1" : date1,
			"date2" : date2
		}
	}
	connection.send(JSON.stringify(packet))
}

function display_last_measure(data){
	document.getElementById("req1").innerHTML = ""
	document.getElementById("req2").innerHTML = ""
	document.getElementById("req3").innerHTML = ""
	document.getElementById("req4").innerHTML = ""
	document.getElementById("req5").innerHTML = ""
	document.getElementById("req6").innerHTML = ""
	document.getElementById("req7").innerHTML = ""
	document.getElementById("req8").innerHTML = ""
	document.getElementById("req9").innerHTML = ""

	document.getElementById("req1").append("sensor_ID : "      + data.number)
	document.getElementById("req2").append("controller_ID : "  + data.raspberry)
	document.getElementById("req3").append("room : "  + data.room)
	document.getElementById("req4").append("battery : "  + data.battery)
	document.getElementById("req5").append("humidity : "  + data.humidity)
	document.getElementById("req6").append("motion : "  + data.motion)
	document.getElementById("req7").append("luminance : "  + data.luminance)
	document.getElementById("req8").append("temperature : "  + data.temperature)
	document.getElementById("req9").append("updatetime : "  + data.updatetime)
}

function display_average(data){
	document.getElementById("reqavg1").innerHTML = ""
	document.getElementById("reqavg2").innerHTML = ""
	document.getElementById("reqavg3").innerHTML = ""
	document.getElementById("reqavg4").innerHTML = ""

	document.getElementById("reqavg1").append("battery : "      + data[0][0]["AVG(battery)"])
	document.getElementById("reqavg2").append("luminance : "  + data[1][0]["AVG(luminance)"])
	document.getElementById("reqavg3").append("humidity : "  + data[2][0]["AVG(humidity)"] )
	document.getElementById("reqavg4").append("temperature : "  + data[3][0]["AVG(temperature)"])
}*/


