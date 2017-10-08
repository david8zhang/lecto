/* global navigator, window, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { streamActions } from '../../widgets';
import styles from './styles.css';

const socket = require('socket.io-client')('https://lecto-ws.herokuapp.com');

class StreamRoomContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			videoSrc: null,
			showingModal: true,
			rooms: []
		};
	}

	componentDidMount() {
		socket.on('message', (message) => this.handleMsg(message));
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.stream && nextProps.stream) {
			if (RTCPeerConnection !== undefined) {
				const isHost = nextProps.profile && 
							(nextProps.profile.name === nextProps.stream.streamerName);
				/** Only the host of the chatroom should be able to see their webcam feed */
				if (isHost) {
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
				}
			}
		}
	}

	componentWillUnmount() {
		console.log('Unmounted');
		/** Disable the webcam */
		if (this.state.mediaStream) {
			this.state.mediaStream.getAudioTracks()[0].stop();
			this.state.mediaStream.getVideoTracks()[0].stop();
		}

		/* disable the old stream so that it doesn't show up in the list of streams */
		if (this.props.stream) {
			const newStream = { ...this.props.stream };
			newStream.inactive = true;
			this.props.editStream(this.props.firebase, newStream);
		}
	}

	handleMsg(message) {
		if (message === 'You are connected!') { return; }
		console.log('Message', message);
		const parsedMsg = JSON.parse(message);
		const isHost = this.props.profile && this.props.profile.name === this.props.stream.streamerName;
		if (!parsedMsg.type) {
			return;
		}
		switch (parsedMsg.type) {
			case 'Join Room': {
				// If we're the host, update the internal room list and send it out to
				// all participants
				if (isHost) {
					const newRooms = this.state.rooms.concat(parsedMsg.payload);
					this.setState({ rooms: newRooms });
					socket.emit('message', JSON.stringify({ type: 'Update Room', payload: newRooms }));
				}
				break;
			}
			case 'Update Room': {
				// If we see an update room list message and we're not the room host,
				// update the room list
				if (!isHost) {
					const newRooms = parsedMsg.payload;
					this.setState({ rooms: newRooms });
				}
				break;
			}
			default:
				console.log('Nothing happened');
		}
	}

	handleVideo(stream) {
		if (window !== undefined) {
			this.setState({ 
				videoSrc: window.URL.createObjectURL(stream),
				mediaStream: stream 
			});
		}
	}

	videoError() {
		console.log('Error');
	}

	joinRoom() {
		socket.emit('message', JSON.stringify({
			type: 'Join Room',
			payload: this.state.name
		}));
	}

	/**
	 * Render the name of the users
	 * @return {React Element} the react modal
	 */
	renderNameInput() {
		const isHost = this.props.profile && 
						(this.props.profile.name === this.props.stream.streamerName);
		if (isHost) {
			return <div />;
		}
		if (!this.state.name || this.state.showingModal) {
			return (
				<ModalContainer onClose={() => browserHistory.push('/')}>
					<ModalDialog onClose={() => browserHistory.push('/')}>
						<div className={styles.modalContent}>
							<h1>Enter your name:</h1>
							<input
								style={{ margin: '5px' }}
								type='text'
								value={this.state.name}
								onChange={(event) => this.setState({ name: event.target.value })}
							/>
							<button
								style={{ margin: '5px' }} 
								onClick={() => {
									this.joinRoom();
									this.setState({ showingModal: false });
								}}
							>
								Submit
							</button>
						</div>
					</ModalDialog>
				</ModalContainer>
			);
		}
	}

	/**
	 * Render all the names in the room
	 * @return {Array} An array of names
	 */
	renderRoom() {
		return this.state.rooms.map((name) => (
			<div>
				<p>{name}</p>
			</div>
		));
	}

	render() {
		if (!this.props.stream) {
			return <div />;
		}
		return (
			<div>
				<h1>Stream Room</h1>
				{ this.renderNameInput() }
				{
					this.state.remoteUrl &&
					<video controls autoPlay src={this.state.remoteUrl} />
				}
				{
					this.state.videoSrc &&
					<video controls autoPlay src={this.state.videoSrc} />
				}
				{ this.renderRoom() }
			</div>
		);
	}
}

const findFocusStream = (state) => {
	if (!state.streams || 
		!state.streams.allStreams ||
		!state.streams.room) {
		return null;
	}
	if (state.streams.allStreams) {
		if (state.streams.room) {
			return state.streams.allStreams[state.streams.room];
		}
	}
	return null;
};

const mapStateToProps = (state) => ({
	stream: findFocusStream(state)
});

export default connect(mapStateToProps, streamActions)(StreamRoomContainer);
