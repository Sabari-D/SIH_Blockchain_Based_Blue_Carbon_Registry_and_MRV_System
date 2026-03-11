import mysql.connector

def get_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="2207@S",
        database="blue_carbon_mrv"
    )
    return connection