/* global navigator, window, RTCPeerConnection */
import React, { Component } from 'react';
import { connect } from 'react-redux';

var socket = require('socket.io-client')('https://lecto-ws.herokuapp.com');

class StreamRoomContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			videoSrc: null
		};
	}

	setupConnection() {
		const configuration = {
			iceServers: [
				{
					urls: 'stun:stun.l.google.com:19302'
				},
				{
					urls: 'turn:192.158.29.39:3478?transport=udp',
					credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
					username: '28224511:1379330808'
				},
				{
					urls: 'turn:192.158.29.39:3478?transport=tcp',
					credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
					username: '28224511:1379330808'
				}
			]
		};
		const pc = new RTCPeerConnection(configuration);
		this.setState({ pc });
		if ()
	}

	componentDidMount() {
		navigator.getUserMedia = navigator.getUserMedia || 
								navigator.webkitGetUserMedia || 
								navigator.mozGetUserMedia || 
								navigator.msGetUserMedia || 
								navigator.oGetUserMedia;
		if (navigator.getUserMedia) {
			navigator.getUserMedia({ video: true, audio: true }, 
				(stream) => this.handleVideo(stream), 
				() => this.videoError());
		}
		if (RTCPeerConnection !== undefined) {
			setupConnection()
		}
	}

	componentWillUnmount() {
		console.log('Unmounted');
		this.state.stream.getAudioTracks()[0].stop();
		this.state.stream.getVideoTracks()[0].stop();
	}

	handleVideo(stream) {
		if (window !== undefined) {
			this.setState({ 
				videoSrc: window.URL.createObjectURL(stream),
				stream 
			});
		}
	}

	videoError() {
		console.log('Error');
	}

	render() {
		return (
			<div>
				<h1>Stream Room</h1>
				{
					this.state.videoSrc &&
					<video controls autoPlay src={this.state.videoSrc} />
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	stream: state.streams.allStreams[state.streams.room]
});

export default connect(mapStateToProps, null)(StreamRoomContainer);
