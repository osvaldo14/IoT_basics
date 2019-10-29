#!/usr/bin/env python
# -*- coding: utf-8 -*- 

import urllib.request, json
import time, threading
import mysql.connector 

#liste des ip des Rapsberry et liste de leurs capteurs
RaspberryPis = [("129.194.184.124",[6,7,15,17]),
                ("129.194.184.125",[3,5,7,8,9,11])]
                 
#champ pour les colonnes de la table des capteurs (2 possibilités)                 
columns_multi  = """ (battery, raspberry, humidity, room, 
                      luminance, motion, number, temperature, updateTime) """
columns_simple = """ (raspberry, room, motion, number, updateTime) """

#Dictionnaire de correction de la numération des salles
correctif = {"A432":"A431b", "A433":"A432","A434":"A433"}

def actualisation():
    
    conn = mysql.connector.connect(host     ="172.20.8.239",
                                   user     ="root",
                                   password ="lama123",
                                   database ="SDI_IoT")
    cursor = conn.cursor()
    
    #Requête pour chaque capteur de chaque Raspberry Pi
    for elem in RaspberryPis:
        for i in elem[1]:
            #Création dictionnaire des valeurs
            urlAddress = "http://%s:5000/sensors/%d/get_all_measures" % (elem[0],i)
            with urllib.request.urlopen(urlAddress) as url:
                data = json.loads(url.read().decode())
                
                #Transformation des valeurs pour pouvoir entrer dans la base de données
                values = list()
                for key in sorted(data.keys()):
                    if data[key] in correctif.keys():
                        values.append(correctif[data[key]])
                    else:
                        values.append(data[key])
                        
                if 'battery' in data.keys():
                    values[1] = int(values[1][3])
                    values = tuple(values)
                    cursor.execute("""INSERT INTO sensors""" + columns_multi + """VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""", values)
                else:
                    values[0] = int(values[0][3])
                    values = tuple(values)
                    cursor.execute("""INSERT INTO sensors""" + columns_simple + """VALUES (%s,%s,%s,%s,%s)""", values)
    conn.commit()
    conn.close()
    threading.Timer(240, actualisation).start()
actualisation()


