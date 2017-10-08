import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { profileActions, authActions } from '../../widgets';

class ProfileLinkContainer extends Component {
	componentDidMount() {
		this.props.fetchProfile(this.props.auth, this.props.firebase);
	}
	render() {
		if (!this.props.profile) {
			return <div />;
		}
		const { name } = this.props.profile;
		return (
			<div>
				<a 
					style={{ color: 'white', cursor: 'pointer', padding: '20px' }}
					onClick={() => browserHistory.push('/profile')}
				>	
					Hello, { name }
				</a>
				<button
					style={{ color: 'white' }}
					className='button primary'
					onClick={() => {
						this.props.setProfile(null);
						this.props.logout(this.props.firebase);
					}}
				>
					Logout
				</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	profile: state.profile
});

const actions = { ...profileActions, ...authActions };

export default connect(mapStateToProps, actions)(ProfileLinkContainer);
