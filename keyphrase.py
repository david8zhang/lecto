# -*- coding: utf-8 -*-

import httplib, urllib
import json

accessKey = '432c5ec68b654a55b3940f64d2e073dc'


def getKeyPhrases(lec):
    """
    Gets the key phrases for a set of documents 
    and creates a wordcloud from that information
    """
    word_dict = {}
    n = len(lec)/10
    parts = [lec[i:i+n] for i in range(0, len(lec), n)]
    
    list_of_docs = []
    for i in range(10):
        document = {'id': str(i+1), 'language': 'en', 'text': parts[i]}
        list_of_docs.append(document)


    documents = { 'documents': list_of_docs}

    uri = 'westus.api.cognitive.microsoft.com'
    path = '/text/analytics/v2.0/keyPhrases'

    headers = {'Ocp-Apim-Subscription-Key': accessKey}
    conn = httplib.HTTPSConnection (uri)
    body = json.dumps (documents)
    conn.request ("POST", path, body, headers)
    response = conn.getresponse ()
    
    result = json.loads(response.read())['documents']
    for i in range(10):
        phrases = result[i]['keyPhrases']
        for phrase in phrases:
            if phrase in word_dict:
                word_dict[phrase] += 1
            else:
                word_dict[phrase] = 1

    return word_dict

def updateKeyPhrase(chats, stream_id):
    phrases = getKeyPhrases(chats)
    child = str(stream_id)+'/keyPhrases'
    fb = firebase.FirebaseApplication('https://your_storage.firebaseio.com', None)
    result = fb.put(child, phrases, {'print': 'silent'}, {'X_FANCY_HEADER': 'VERY FANCY'})
    return child

