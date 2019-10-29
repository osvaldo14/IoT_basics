import mysql.connector


def last_measure(controllerID,sensorID):
    #connect to our database :
    conn = mysql.connector.connect(host="172.20.11.186",
                                   user="root",
                                   password="lama123",
                                   database="SDI_IoT")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sensors WHERE id = sensorID AND raspberry = controllerID ORDER BY updateTime DESC LIMIT 1")
    rows = cursor.fetchall()


    print(rows[0])

    #Closing connection
    cursor.close()
    conn.close()


def average(roomID,number):
    # connect to our database :
    conn = mysql.connector.connect(host="localhost",
                                   user="root",
                                   password="lama123",
                                   database="SDI_IoT")
    cursor = conn.cursor()
    #ne prend pas en compte le nombre
    cursor.execute("SELECT AVG(battery), AVG(humidity, luminance, temperature) FROM sensors WHERE room = roomID")
    rows = cursor.fetchall()

    print(rows[0])

    # Closing connection
    cursor.close()
    conn.close()


def two_dates(sensorID,date1,date2):
    # connect to our database :
    conn = mysql.connector.connect(host="localhost",
                                   user="root",
                                   password="lama123",
                                   database="SDI_IoT")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sensors WHERE id = sensorID AND updatetime >= date1 AND updatetime <=date2 ")
    rows = cursor.fetchall()

    for row in rows:
        print(row)

    # Closing connection
    cursor.close()
    conn.close()
