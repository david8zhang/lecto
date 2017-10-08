	/* global navigator, window, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { streamActions } from '../../widgets';
import styles from './styles.css';

const socket = require('socket.io-client')('https://lecto-ws.herokuapp.com');

const uuidV4 = require('uuid/v4');

/* eslint-disable */
const configuration = {
	iceServers: [
		{url:'stun:stun01.sipphone.com'},
		{url:'stun:stun.ekiga.net'},
		{url:'stun:stun.fwdnet.net'},
		{url:'stun:stun.ideasip.com'},
		{url:'stun:stun.iptel.org'},
		{url:'stun:stun.rixtelecom.se'},
		{url:'stun:stun.schlund.de'},
		{url:'stun:stun.l.google.com:19302'},
		{url:'stun:stun1.l.google.com:19302'},
		{url:'stun:stun2.l.google.com:19302'},
		{url:'stun:stun3.l.google.com:19302'},
		{url:'stun:stun4.l.google.com:19302'},
		{url:'stun:stunserver.org'},
		{url:'stun:stun.softjoys.com'},
		{url:'stun:stun.voiparound.com'},
		{url:'stun:stun.voipbuster.com'},
		{url:'stun:stun.voipstunt.com'},
		{url:'stun:stun.voxgratia.org'},
		{url:'stun:stun.xten.com'},
		{
			url: 'turn:numb.viagenie.ca',
			credential: 'muazkh',
			username: 'webrtc@live.com'
		},
		{
			url: 'turn:192.158.29.39:3478?transport=udp',
			credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
			username: '28224511:1379330808'
		},
		{
			url: 'turn:192.158.29.39:3478?transport=tcp',
			credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
			username: '28224511:1379330808'
		}
	]
}
/* eslint-enable */

const rtcConns = {};

const iceCandidateQueue = [];

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
		const isHost = this.props.profile && this.props.profile.name === this.props.stream.streamerName;

		/** Disable the webcam */
		if (this.state.mediaStream) {
			this.state.mediaStream.getAudioTracks()[0].stop();
			this.state.mediaStream.getVideoTracks()[0].stop();
		}

		/* disable the old stream so that it doesn't show up in the list of streams */
		if (this.props.stream && isHost) {
			const newStream = { ...this.props.stream };
			newStream.inactive = true;
			this.props.editStream(this.props.firebase, newStream);
		}

		if (isHost) {
			socket.emit('message', JSON.stringify({
				type: 'End Session'
			}));
		} else {
			socket.emit('message', JSON.stringify({
				type: 'Leave Room',
				payload: this.state.uid
			}));
		}
	}

	/**
	 * Process the ICE Candidate setup
	 * @param  {Object} msg The message passed through the signalling server
	 * @return {None}     
	 */
	processICE(msg) {
		const { payload } = msg;
		const isHost = this.props.profile && this.props.profile.name === this.props.stream.streamerName;
		if (payload.uid === this.state.uid && !isHost) {
			if (!this.state.pc) {
				this.establishParticipant();
			}
			if (payload.candidate) {
				if (!this.state.pc || !this.state.pc.remoteDescription.type) {
					console.log('Added candidate', payload.candidate.candidate);
					iceCandidateQueue.push(payload.candidate);
				} else {
					this.state.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
				}
			}
		} else if (payload.host && isHost) {
			const { selfUid } = payload;
			const clientPC = rtcConns[selfUid];
			if (payload.candidate) {
				if (!clientPC || !clientPC.remoteDescription.type) {
					console.log('Added candidate', payload.candidate.candidate);
					iceCandidateQueue.push(payload.candidate);
				} else {
					clientPC.addIceCandidate(new RTCIceCandidate(payload.candidate));
				}
			}
		}
	}

	/**
	 * Process the RTCSessionDescription
	 * @param  {Object} msg The message passed through the signalling server
	 * @return {[type]}     [description]
	 */
	processSignal(msg) {
		const { payload } = msg;
		const isHost = this.props.profile && this.props.profile.name === this.props.stream.streamerName;
		/** If the payload uid equals our own, then this is a message from the host
		to the participant */
		if (payload.uid === this.state.uid && !isHost) {
			/** If there is no current RTC Connection, create one */
			if (!this.state.pc) {
				this.establishParticipant();
			}

			/** A callback function that formulates a RTCSessionDescription message to the host */
			const localDescCreated = (desc) => {
				this.state.pc.setLocalDescription(desc, () => {
					socket.emit('message', JSON.stringify({
						type: 'Signaling',
						payload: {
							host: true,
							selfUid: this.state.uid,
							sdp: this.state.pc.localDescription
						}
					}));
				});
			};

			/** Set the remote RTCSessionDescription */
			this.state.pc.setRemoteDescription(new RTCSessionDescription(payload.sdp), () => {
				if (this.state.pc.remoteDescription.type === 'offer') {
					// If we received an offer, we need to send out an answer
					this.state.pc.createAnswer(localDescCreated, (err) => console.log('Error', err));
				}
				iceCandidateQueue.forEach((candidate) => {
					console.log('Added ICE Candidate', candidate);
					this.state.pc.addIceCandidate(new RTCIceCandidate(candidate));
				});
			});
		} else if (payload.host && isHost) {
			/** If we didn't get a uid, then this was a message sent from a participant to a host */
			const { selfUid } = payload;

			/** Fetch the requisite RTCPeerConnection that was established with the given participant */
			const clientPC = rtcConns[selfUid];

			console.log('RTCConns', rtcConns);
			console.log('ClientPc', clientPC);

			/** a callback function that formulates a RTCSessionDescription to the supposed participant */
			const localDescCreated = (desc) => {
				clientPC.setLocalDescription(desc, () => {
					socket.emit('message', JSON.stringify({
						type: 'Signaling',
						payload: {
							uid: selfUid,
							sdp: clientPC.localDescription
						}
					}));
				});
			};

			/** Set the remote RTCSessionDescription */
			clientPC.setRemoteDescription(new RTCSessionDescription(payload.sdp), () => {
				if (clientPC.remoteDescription.type === 'offer') {
					clientPC.createAnswer(localDescCreated, (err) => console.log('Error', err));
				}
				iceCandidateQueue.forEach((candidate) => {
					clientPC.addIceCandidate(new RTCIceCandidate(candidate));
				});
			});
		}
	}

	/**
	 * Establish a Participant RTCPeerConnection. Each Participant only has one RTCPeerConnection
	 * @return {None} 
	 */
	establishParticipant() {
		const pc = new RTCPeerConnection(configuration);
		this.setState({ pc });
		pc.onicecandidate = (evt) => {
			if (evt) {
				socket.emit('message', JSON.stringify({
					type: 'Add ICE Candidate',
					payload: {
						host: true,
						selfUid: this.state.uid,
						candidate: evt.candidate
					}
				}));
			}
		};

		pc.onnegotiationneeded = () => {
			pc.createOffer(localDescCreated, (err) => console.log(err));
		};

		pc.onaddstream = (evt) => {
			console.log('Added Stream', evt);
			this.setState({
				remoteUrl: window.URL.createObjectURL(evt.stream)
			});
		};

		const localDescCreated = (desc) => {
			pc.setLocalDescription(desc, () => {
				socket.emit('message', JSON.stringify({
					type: 'Signaling',
					payload: {
						host: true,
						selfUid: this.state.uid,
						sdp: pc.localDescription
					}
				}));
			});
		};
	}

	/**
	 * Establish the RTC signalling handshake
	 * @param  {String} uid The uid of peer to send the message to
	 * @return {None}     
	 */
	establishHost(uid) {
		const pc = new RTCPeerConnection(configuration);
		rtcConns[uid] = pc;

		pc.addStream(this.state.mediaStream);

		// Send ICE candidates to the other peer
		pc.onicecandidate = (evt) => {
			if (evt) {
				socket.emit('message', JSON.stringify({ 
					type: 'Add ICE Candidate', 
					payload: {
						uid,
						candidate: evt.candidate
					}
				}));
			}
		};

		// Let the negotiation needed 
		pc.onnegotiationneeded = () => {
			pc.createOffer(localDescCreated, (err) => console.log(err));
		};

		const localDescCreated = (desc) => {
			pc.setLocalDescription(desc, () => {
				socket.emit('message', JSON.stringify({
					type: 'Signaling',
					payload: {
						uid,
						sdp: pc.localDescription
					}
				}));
			}, (err) => console.log(err));
		};
	}

	handleMsg(message) {
		if (message === 'You are connected!') { return; }
		const parsedMsg = JSON.parse(message);
		const isHost = this.props.profile && this.props.profile.name === this.props.stream.streamerName;
		if (!parsedMsg.type) {
			return;
		}
		switch (parsedMsg.type) {
			case 'Join Room': {
				// If we're the host, update the internal room list and send it out to
				// all participants. In addition, the host needs to establish an 
				// RTCPeerConnection signalling exchange
				if (isHost) {
					const newRooms = this.state.rooms.concat(parsedMsg.payload);
					this.setState({ rooms: newRooms });
					socket.emit('message', JSON.stringify({ type: 'Update Room', payload: newRooms }));
					this.establishHost(parsedMsg.payload.uid);
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
			case 'Add ICE Candidate': {
				this.processICE(parsedMsg);
				break;
			}
			case 'Signaling': {
				this.processSignal(parsedMsg);
				break;
			}
			case 'End Session': {
				if (!isHost) {
					browserHistory.push('/');
				}
				break;
			}
			case 'Leave Room': {
				if (isHost) {
					const newRooms = [];
					this.state.rooms.forEach((user) => {
						console.log('payload', parsedMsg.payload);
						console.log('uid', user.uid);
						if (user.uid !== parsedMsg.payload) {
							newRooms.push(user);
						}
					});
					this.setState({ rooms: newRooms });
					socket.emit('message', JSON.stringify({ type: 'Update Room', payload: newRooms }));
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
		const uid = uuidV4();
		this.setState({ uid });
		socket.emit('message', JSON.stringify({
			type: 'Join Room',
			payload: {
				name: this.state.name,
				uid
			}
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

	render() {
		if (!this.props.stream) {
			return <div />;
		}
		return (
			<div className={styles.roomWrapper}>
				<div className={styles.videoSection}>
					{ this.renderNameInput() }
					{
						this.state.remoteUrl &&
						<video
							className={styles.video}
							controls
							autoPlay
							src={this.state.remoteUrl} 
						/>
					}
					{
						this.state.videoSrc &&
						<video
							className={styles.video}
							controls 
							autoPlay 
							src={this.state.videoSrc} 
						/>
					}
					<h1>{this.props.stream.name}</h1>
					<p>{this.props.stream.streamerName}</p>
					<hr />
					<p>{this.props.stream.description}</p>
				</div>
				<div className={styles.chatSection}>
				</div>
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
