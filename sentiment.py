# -*- coding: utf-8 -*-

import httplib, urllib
import json
import pyrebase

accessKey = '432c5ec68b654a55b3940f64d2e073dc'

def getSentiment(chats):
    """
    Gets the key phrases for a set of documents 
    and creates a wordcloud from that information
    """
    
    list_of_docs = []
    for i in range(len(chats)):
        document = {'id': str(i+1), 'language': 'en', 'text': chats[i]}
        list_of_docs.append(document)

    documents = { 'documents': list_of_docs}

    uri = 'westus.api.cognitive.microsoft.com'
    path = '/text/analytics/v2.0/sentiment'

    headers = {'Ocp-Apim-Subscription-Key': accessKey}
    conn = httplib.HTTPSConnection (uri)
    body = json.dumps (documents)
    conn.request ("POST", path, body, headers)
    response = conn.getresponse ()
    
    scores = json.loads(response.read())['documents']
    avg = 0.0
    for score in scores:
        avg += score['score']
    return (avg/len(scores))


def updateSentiment(timestamp, chats, stream_id):
    sentiment = getSentiment(chats)
    child = 'streams'+stream_id+'/sentiment/'+timestamp

    config = {
        "apiKey": "AIzaSyAlVLyZDQHfBbOwv7BLs8z2eFTiRYzjGgk",
        "authDomain": "lecto-4317a.firebaseapp.com",
        "databaseURL": "https://lecto-4317a.firebaseio.com",
        "storageBucket": "lecto-4317a.appspot.com"
    
    }

    firebase = pyrebase.initialize_app(config)
    db = firebase.database()
    db.child('streams').child(stream_id).child('sentiment').child(timestamp).set(sentiment)

    return child