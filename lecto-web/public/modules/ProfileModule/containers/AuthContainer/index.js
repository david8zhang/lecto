import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authActions, profileActions } from '../../widgets';
import styles from './styles.css';

class AuthContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: true,
			username: '',
			password: '',
			confirmPass: ''
		};
	}
	onSubmit() {
		const params = { email: this.state.email, password: this.state.password };
		if (this.state.login) {
			this.props.login(params, this.props.firebase);
			this.props.onSubmit();
		} else if (this.state.password !== this.state.confirmPass) {
			this.setState({ error: 'Passwords do not match' });
		} else {
			this.props.signUp(params, { name: this.state.username }, this.props.firebase);
			this.props.onSubmit();
		}
	}
	render() {
		return (
			<div className={styles.authWrapper}>
				{
					this.state.error &&
					<p style={{ color: 'red' }}>
						{this.state.error}
					</p>
				}
				<h1>{this.state.login ? 'Log In' : 'Sign up'}</h1>
				{
					!this.state.login &&
					<input
						className={styles.authElement}
						placeholder='Enter a username'
						type='text'
						value={this.state.username} 
						onChange={(event) => this.setState({ username: event.target.value })} 
					/>
				}
				<input
					className={styles.authElement}
					placeholder='Enter an email'
					type='text'
					value={this.state.email}
					onChange={(event) => this.setState({ email: event.target.value })}
				/>
				<input
					className={styles.authElement}
					placeholder='Enter a password'
					type='password'
					value={this.state.password}
					onChange={(event) => this.setState({ password: event.target.value })}
				/>
				{
					!this.state.login &&
					<input
						className={styles.authElement}
						placeholder='Confirm your password'
						type='password'
						value={this.state.confirmPass}
						onChange={(event) => this.setState({ confirmPass: event.target.value })}
					/>
				}
				<a
					style={{ cursor: 'pointer', marginTop: '10px' }}
					onClick={() => this.setState({ login: !this.state.login })}
				>
					{ 
						this.state.login ? 
						"Don't have an account? Sign up here" : 
						'Have an account already? Log in here'
					}
				</a>
				<button 
					style={{ marginTop: '10px' }}
					onClick={() => this.onSubmit()}
					className={`button-primary ${styles.authElement}`}
				>
					{ this.state.login ? 'Login' : 'Sign Up' }
				</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(mapStateToProps, { ...authActions, ...profileActions })(AuthContainer);
