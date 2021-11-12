# -*- coding: utf-8 -*-

import httplib, urllib
import json
import pyrebase
import matplotlib.pyplot as plt
from wordcloud import WordCloud

accessKey = '432c5ec68b654a55b3940f64d2e073dc'


def getKeyPhrases(lec, stream_id):
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

	wc = WordCloud(background_color="white").fit_words(word_dict)
	plt.imshow(wc, interpolation='bilinear')
	plt.axis("off")
	plt.savefig(stream_id+".png")

	return word_dict

def updateKeyPhrase(chats, stream_id):
	phrases = getKeyPhrases(chats, stream_id)
	child = 'streams/'+stream_id+'/keyPhrases'
	config = {
  		"apiKey": "AIzaSyAlVLyZDQHfBbOwv7BLs8z2eFTiRYzjGgk",
  		"authDomain": "lecto-4317a.firebaseapp.com",
  		"databaseURL": "https://lecto-4317a.firebaseio.com",
  		"storageBucket": "lecto-4317a.appspot.com"
	
	}

	firebase = pyrebase.initialize_app(config)
	db = firebase.database()
	db.child('streams').child(stream_id).child('keyPhrases').set(phrases)

	# storage = firebase.storage()
	# storage.child(child).put(str(stream_id)+".png")

	return child
