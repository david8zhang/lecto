import React, { Component } from 'react';
import Webcam from 'react-webcam';

class BaseContainer extends Component {
	setRef = (webcam) => {
		console.log('webcam', this.webcam);
		console.log(webcam);
		this.webcam = webcam;
	}

	render() {
		return (
			<div style={{ padding: '20px' }}>
				<h1>Welcome to the React Serverside Boilerplate</h1>
				<Webcam
					audio={false}
					height={350}
					ref={this.setRef}
					screenshotFormat="image/jpeg"
					onUserMedia={(res) => console.log(res)}
					width={350}
					onUser
				/>
			</div>
		);
	}
}

export default BaseContainer;
