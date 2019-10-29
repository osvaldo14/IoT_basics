#import dateutil
from flask import Flask
from flask import render_template
import mysql.connector


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello Oscar!'

@app.route('/get_last_measure_sensor/<controllerID>/<sensorID>')
#get the last measurement of a specific sensor
def last_measure(controllerID,sensorID):
    #connect to our database :
    conn = mysql.connector.connect(host="localhost",
                                   user="root",
                                   password="lama123",
                                   database="IoT")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sensors WHERE number =" + str(sensorID) +" AND raspberry =" + str(controllerID) + " ORDER BY updateTime DESC LIMIT 1")
    rows = cursor.fetchall()


    r = list(rows[0])
    result = ' '.join([str(elem) for elem in r])
    return render_template('Sensor_last_measure.html',Title = 'Last', data = result)

    #Closing connection
    cursor.close()
    conn.close()



@app.route('/get_average_measure_room/<roomID>/<number>')
#process the average of the x(number) last measurements of the sensors in a specific room
def average(roomID,number):
    # connect to our database :
    conn = mysql.connector.connect(host="localhost",
                                   user="root",
                                   password="lama123",
                                   database="IoT")
    cursor = conn.cursor()

    cursor.execute("SELECT AVG(battery) FROM sensors WHERE room = " + str(roomID) + " LIMIT  " + str(number) + " ")
    rows = cursor.fetchall()

    cursor.execute("SELECT AVG(luminance) FROM sensors WHERE room = " + str(roomID) + " LIMIT  " + str(number) + " ")
    rows1 = cursor.fetchall()

    cursor.execute("SELECT AVG(humidity) FROM sensors WHERE room = " + str(roomID) + " LIMIT  " + str(number) + " ")
    rows2 = cursor.fetchall()

    cursor.execute("SELECT AVG(temperature) FROM sensors WHERE room = " + str(roomID) + " LIMIT  " + str(number) + " ")
    rows3 = cursor.fetchall()

    result = " " + str(rows) + " " + str(rows1) + " " + str(rows2) + " " + str(rows3) + " "

    return render_template('Average.html',Title = 'Last', data = str(result))

    # Closing connection
    cursor.close()
    conn.close()



#get_measure_2dates/2/3/2018-12-05T10:06:04+01:00/2335-10-26T04:53:18+02:00
#get_measure_2dates/2/3/1544000764/11544000798
@app.route('/get_measure_2dates/<controllerID>/<sensorID>/<date1>/<date2>')
#get the measurement of a specific sensor between two dates
def measures_2dates(sensorID, controllerID, date1, date2):
  #connect to our database :
  conn = mysql.connector.connect(host="localhost",
                                 user="root",
                                 password="lama123",
                                 database="IoT")
  cursor = conn.cursor()
  #d1 = str(int(dateutil.parser.parse(date1).timestamp()))
  #d2 = str(int(dateutil.parser.parse(date2).timestamp()))
  cursor.execute("SELECT * FROM sensors WHERE number =" + str(sensorID) + " AND raspberry =" + str(controllerID) + " AND updateTime >=" + date1 + " AND updateTime <= " + date2 + " ORDER BY updateTime DESC")
  rows = cursor.fetchall()
  r = list(rows)
  result = ' '.join([str(elem) for elem in r])
  return render_template('2Dates_Measure.html', Title='Last', data=result)

  #Closing connection
  cursor.close()
  conn.close()

if __name__ == '__main__':
    app.run()



"""
@api {get} get_last_measure_sensor/:controllerID/:sensorID Request the last measure of a specific sensor
@apiName Last
@apiGroup Sensor

@apiParam {Number} controllerID ID of a controller.
@apiParam {Number} sensorID ID of a sensor.

@apiSuccess {Number} ID ID of the measure.
@apiSuccess {Number} number  Lastname of the User.
@apiSuccess {Number} raspberry The controller ID.
@apiSuccess {String} room  Room number.
@apiSuccess {Number} battery Battery measure.
@apiSuccess {Number} humidity  Humidity measure.
@apiSuccess {Number} luminance Luminance measure.
@apiSuccess {Number} motion  Motion measure.
@apiSuccess {Float} temperature Temperature measure.
@apiSuccess {Number} updateTime  Last measure's timestamp .

@apiSuccessExample {json} Success-Response
 HTTP/1.1 200 OK
 [
  {
    "id": 255
    "sensors_id": 3,
    "controllerID": 2,
    "room": "A505",
    "battery": 100,
    "humidity": 20,
    "motion": 0,
    "luminance": 0,
    "temperature": 22.4, 
    "updateTime": 1544553907, 
  }
 ]
"""
""" 
@api {get} get_average_measure_room/:roomID/:number Request the average of the x(number) last measurements of the sensors in a specific room
@apiName Average
@apiGroup Sensor

@apiParam {String} Room Number of a specific room ("A505").
@apiParam {Number} Number Amount of data.

@apiSuccess {Float} battery Battery measure.
@apiSuccess {Float} luminance Luminance measure.
@apiSuccess {Float} humidity  Humidity measure.
@apiSuccess {Float} temperature Temperature measure.

@apiSuccessExample {json} Success-Response
 HTTP/1.1 200 OK
 [
  {
    "battery": 100.000,
    "luminance": 28.6923,
    "humidity": 23.3077,
    "temperature": 22.88461523789626,
  }
 ]
"""
"""
@api {get} /get_measure_2dates/:controllerID/:sensorID/:date1/:date2/ Get all the measures of a specific sensor collected between two dates
@apiName GetMeasures
@apiGroup Sensor
@apiParam {Number} controllerID Raspberry number id.
@apiParam {Number} sensorID sensor number.
@apiParam {String} date1 starting date, must be in iso 8061 format
@apiParam {String} date2 ending date, must be in iso 8061 format

@apiSuccess {Array[Tuple]} measures Array containing tuples of measures between starting date and ending date. Each tuple contains the following fields : raspberry, room, battery, humidity, luminance, motion, temprature, motion, temperature, updateTime
@apiSuccess {Number} raspberry The controller ID.
@apiSuccess {String} room Room number.
@apiSuccess {Number} battery Battery measure.
@apiSuccess {Number} humidity Humidity measure.
@apiSuccess {Number} luminance Luminance measure.
@apiSuccess {Number} motion Motion measure.
@apiSuccess {Float} temperature Temperature measure.
@apiSuccess {Number} updateTime Last measure's timestamp .

@apiSuccessExample {json} Success-Response
HTTP/1.1 200 OK
[
 {
  "id": 255
  "sensors_id": 3,
  "controllerID": 2,
  "room": "A505",
  "battery": 100,
  "humidity": 20,
  "motion": 0,
  "luminance": 0,
  "temperature": 22.4,
  "updateTime": 1544553907,
 },
 {
  "id": 255
  "sensors_id": 3,
  "controllerID": 2,
  "room": "A505",
  "battery": 100,
  "humidity": 20,
  "motion": 0,
  "luminance": 0,
  "temperature": 22.4,
  "updateTime": 1544551267,
 }
]
"""