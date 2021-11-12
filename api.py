from flask import Flask, request, jsonify, json  # imported the flask entry
import keyphrase as kp
import sentiment as se

app = Flask("__name__")  # created a flask instance

@app.route('/keyPhrase', methods=['POST'])
def keyPhrase():
	try:
		data = json.loads(request.data)
		print data
	except ValueError:
		return "Value error detected"

	if 'stream_id' in data and isinstance(data['stream_id'], int) and\
		'chats' in data and isinstance(data['chats'], unicode) and len(data.keys()) == 2:

		response = kp.updateKeyPhrase(data['chats'], data['stream_id'])
	else:
		response = "Body is not in proper format"

	return response

@app.route('/sentiment', methods=['POST'])
def sentiment():
	try:
		data = json.loads(request.data)
	except ValueError:
		return "Value error detected"

	if 'stream_id' in data and isinstance(data['stream_id'], int) and\
		'chats' in data and isinstance(data['chats'], list) and\
		'timestamp' in data and isinstance(data['timestamp'], unicode) and len(data.keys()) == 3:
		
		response = se.updateSentiment(data['timestamp'], data['chats'], data['stream_id'])
	else:
		response = "Body is not in proper format"

	return response

if __name__ == 'main':
	app.run(debug=True)

# KeyPhrase JSON input: {'stream_id': int, 'chats': str} <- all chats as one string
# Sentiment JSON input: {'stream_id': int, 'chats': list, timestamp: str(?)} 
											# ^-- last n chats as individual strings in a list