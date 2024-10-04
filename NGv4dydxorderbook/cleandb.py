import psycopg
import os

if os.environ.get('ORDERBOOKSERVER') != None and os.environ.get('ORDERBOOKSERVER') != '':
        mysqlhost = os.environ.get('ORDERBOOKSERVER')
else:
        mysqlhost = 'localhost'

conn = psycopg.connect("dbname=orderbook user=vmware")

mycursor = conn.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name<>'orderbookindex' AND table_name<>'server' AND table_name<>'client' AND table_name<>'tserver' AND table_name<>'tclient' AND table_name<>'mserver' AND table_name<>'mclient' AND table_name<>'v4orderbookindex' AND table_name<>'v4server' AND table_name<>'v4client' AND table_name<>'v4tserver' AND table_name<>'v4tclient' AND table_name<>'v4mserver' AND table_name<>'v4mclient';")
list = mycursor.fetchall()
conn.commit()
for member in list:
        print("DROP TABLE "+member[0]+";")
        mycursor.execute("DROP TABLE "+member[0]+";")
        conn.commit()
mycursor = conn.execute("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name='orderbookindex');")
recordexists = mycursor.fetchone()[0]
conn.commit()
if recordexists == True:
        print("DELETE FROM orderbookindex;")
        mycursor.execute("DELETE FROM orderbookindex;")
        conn.commit()
        print("DELETE FROM server;")
        mycursor.execute("DELETE FROM server;")
        conn.commit()
        print("DELETE FROM client;")
        mycursor.execute("DELETE FROM client;")
        conn.commit()
        print("DELETE FROM tserver;")
        mycursor.execute("DELETE FROM tserver;")
        conn.commit()
        print("DELETE FROM tclient;")
        mycursor.execute("DELETE FROM tclient;")
        conn.commit()
        print("DELETE FROM mserver;")
        mycursor.execute("DELETE FROM mserver;")
        conn.commit()
        print("DELETE FROM mclient;")
        mycursor.execute("DELETE FROM mclient;")
        conn.commit()
mycursor = conn.execute("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name='v4orderbookindex');")
recordexists = mycursor.fetchone()[0]
conn.commit()
if recordexists == True:
        print("DELETE FROM v4orderbookindex;")
        mycursor.execute("DELETE FROM v4orderbookindex;")
        conn.commit()
        print("DELETE FROM v4server;")
        mycursor.execute("DELETE FROM v4server;")
        conn.commit()
        print("DELETE FROM v4client;")
        mycursor.execute("DELETE FROM v4client;")
        conn.commit()
        print("DELETE FROM v4tserver;")
        mycursor.execute("DELETE FROM v4tserver;")
        conn.commit()
        print("DELETE FROM v4tclient;")
        mycursor.execute("DELETE FROM v4tclient;")
        conn.commit()
        print("DELETE FROM v4mserver;")
        mycursor.execute("DELETE FROM v4mserver;")
        conn.commit()
        print("DELETE FROM v4mclient;")
        mycursor.execute("DELETE FROM v4mclient;")
        conn.commit()
