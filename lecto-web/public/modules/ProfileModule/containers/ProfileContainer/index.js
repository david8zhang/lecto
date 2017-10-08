import React, { Component } from 'react';
import { connect } from 'react-redux';
import { profileActions } from '../../widgets';
import styles from './styles.css';

class ProfileContainer extends Component {
	componentDidMount() {
		if (!this.props.profile) {
			this.props.fetchProfile(this.props.auth, this.props.firebase);
		}
	}
	render() {
		if (!this.props.profile) {
			return <div />;
		}
		return (
			<div className={styles.profileWrapper}>
				<h1>{this.props.profile.name}</h1>
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

const mapStateToProps = (state) => ({
	profile: state.profile
});

export default connect(mapStateToProps, profileActions)(ProfileContainer);
