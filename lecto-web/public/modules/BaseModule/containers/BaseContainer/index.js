/* global window */
/** React, Redux */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import firebase from 'firebase';

/** Containers, Components */
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { Navbar, Jumbotron, About } from '../../../../components';
import { StreamListContainer, StreamRoomContainer, streamActions } from '../../../StreamModule';
import { ProfileContainer, profileActions } from '../../../ProfileModule';

/** Configuration  */
import { baseModuleConfig } from '../../config';
import styles from './styles.css';

const uuidV4 = require('uuid/v4');

const fbConf = {
    apiKey: 'AIzaSyAlVLyZDQHfBbOwv7BLs8z2eFTiRYzjGgk',
    authDomain: 'lecto-4317a.firebaseapp.com',
    databaseURL: 'https://lecto-4317a.firebaseio.com',
    projectId: 'lecto-4317a',
    storageBucket: '',
    messagingSenderId: '1005446069760'
};

firebase.initializeApp(fbConf);

class BaseContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			name: '',
			description: '',
			createModal: false
		};
	}
	getStreamList() {
		return <StreamListContainer firebase={firebase} />;
	}

	getStreamRoom() {
		return (
			<StreamRoomContainer 
				profile={this.props.profile}
				firebase={firebase}
			/>
		);
	}

	getProfileContainer() {
		return (
			<ProfileContainer
				submitText='Create Stream' 
				onClick={() => {
					this.setState({ createModal: true });
				}}
			/>
		);
	}

	renderCreateStreamModal() {
		if (this.state.createModal) {
			return (
				<ModalContainer onClose={() => this.setState({ createModal: false })}>
					<ModalDialog onClose={() => this.setState({ createModal: false })}>
						<div className={styles.modalContent}>
							<h1>Create a New Stream</h1>
							<input
								className={styles.input}
								type='text'
								placeholder='Enter a title for the stream'
								onChange={(event) => this.setState({ title: event.target.value })}
								value={this.state.title}
							/>
							<input 
								className={styles.input}
								type='text'
								placeholder='Enter your name'
								onChange={(event) => this.setState({ name: event.target.value })}
								value={this.state.name}
							/>
							<textarea
								className={styles.input}
								type='text'
								rows='5'
								placeholder='Enter a description'
								onChange={(event) => this.setState({ description: event.target.value })}
								value={this.state.description}
							/>
							<button 
								className='button-primary' 
								onClick={() => {
									const uuid = uuidV4();
									const newStream = {
										name: this.state.title,
										description: this.state.description,
										streamerName: this.state.name,
										rating: 3.5,
										streamId: uuid
									};
									/** Create the stream and set it as the stream to focus on in redux */
									this.props.createStream(firebase, newStream);
									this.props.setStream(uuid);

									// TODO: stand in for authentication (just-in-time authentication lol)
									this.props.setProfile({ name: this.state.name });

									/* Clear out the modal and redirect elsewhere */
									this.setState({ title: '', description: '', name: '', createModal: false });
									browserHistory.push('/streams/room');
								}}
							>
								Create Stream
							</button>
						</div>
					</ModalDialog>
				</ModalContainer>
			);
		}
	}

	renderChildPages() {
		switch (this.props.location.pathname) {
			case '/streams':
				return this.getStreamList();
			case '/streams/room':
				return this.getStreamRoom();
			case '/profile':
				return this.getProfileContainer();
			default:
				return null;
		}
	}
	renderChildren() {
		const { jumboProps, aboutProps } = baseModuleConfig;
		let aboutProp;
		if (typeof window !== 'undefined') {
			aboutProp = aboutProps(window);
		}
		return (
			<div>
				{
					this.renderChildPages() ||
					<div>
						<Jumbotron {...jumboProps} />
						{ aboutProp && <About {...aboutProp} /> }
					</div>
				}
			</div>
		);
	}
	renderNavbar() {
		const { buttonStyle } = baseModuleConfig;
		return (
			<Navbar 
				preset='dash' 
				title='lecto'
				homeRedirect={() => browserHistory.push('/')}
			>
				<button
					className='button'
					style={{
						...buttonStyle,
						backgroundColor: '#26A65B',
						borderColor: '#26A65B'
					}}
					onClick={() => { browserHistory.push('/profile'); }}
				>
					Login
				</button>
			</Navbar>
		);
	}
	render() {
		return (
			<div>
				{ this.renderCreateStreamModal() }
				{ this.renderNavbar() }
				{ this.renderChildren() }
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	profile: state.profile
});

export default connect(mapStateToProps, { ...streamActions, ...profileActions })(BaseContainer);
