import React, { Component } from 'react';
import styles from './styles.css';

class About extends Component {
	renderActionButtons() {
		const actionButtons = this.props.actionButtons.map((actionButton) => (
			<button
				key={actionButton.text} 
				className='button'
				style={actionButton.style}
				onClick={actionButton.onClick}
			>
				{ actionButton.text }
			</button>
		));
		return (
			<div className={styles.actionButtonsStyle}>
				{ actionButtons }
			</div>
		);
	}
	render() {
		return (
			<div 
				className={styles.about}
				style={this.props.about}
			>
				<h1 className={styles.aboutTitle}>
					{ this.props.title }
				</h1>
				<hr className={styles.divider} />
				<p>{ this.props.description }</p>
				{ this.renderActionButtons() }
			</div>
		);
	}
}

About.defaultProps = {
	title: 'About Me',
	description: `Lorem ipsum dolor sit amet, 
	consectetur adipiscing elit, sed do eiusmod 
	tempor incididunt ut labore et dolore magna aliqua. 
	Ut enim ad minim veniam, quis nostrud exercitation 
	ullamco laboris nisi ut aliquip ex ea commodo consequat. 
	Duis aute irure dolor in reprehenderit in voluptate 
	velit esse cillum dolore eu fugiat nulla pariatur. 
	Excepteur sint occaecat cupidatat non proident, sunt 
	in culpa qui officia deserunt mollit anim id est laborum`,
	actionButtons: [{
		text: 'Action 1',
		style: { 
			backgroundColor: '#00E676', 
			color: 'white',
			fontFamily: 'Avenir, sans-serif',
			marginRight: '5px',
			borderColor: '#00E676'
		},
		onClick: () => console.log('Action 1')
	}, {
		text: 'Action 2',
		style: { 
			backgroundColor: '#22A7F0', 
			color: 'white',
			fontFamily: 'Avenir, sans-serif',
			borderColor: '#22A7F0'
		},
		onClick: () => console.log('Action 2')
	}]
};

export default About;
