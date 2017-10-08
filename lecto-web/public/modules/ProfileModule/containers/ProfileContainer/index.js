import React, { Component } from 'react';

class ProfileContainer extends Component {
	render() {
		return (
			<div>
				<button 
					className='button-primary'
					onClick={() => this.props.onClick()}
				>
					{ this.props.submitText }
				</button>
			</div>
		);
	}
}

export default ProfileContainer;
