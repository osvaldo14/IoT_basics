#!/usr/bin/env python
# -*- coding: utf-8 -*- 

import json
import mysql.connector 


conn = mysql.connector.connect(host     ="172.20.11.186",
                                   user     ="root",
                                   password ="lama123",
                                   database ="SDI_IoT")
cursor = conn.cursor()

sensorID 		= 3
controllerID 	= 2

cursor.execute("SELECT * FROM sensors WHERE number =" + str(sensorID) +" AND raspberry =" + str(controllerID) + " ORDER BY updateTime DESC LIMIT 1")

rows = cursor.fetchall()

print(str(rows[0]))

conn.commit()
conn.close()


