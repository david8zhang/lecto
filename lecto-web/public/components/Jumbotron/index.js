import React, { Component } from 'react';
import styles from './styles.css';

class Jumbotron extends Component {
	renderActionButtons() {
		const actionButtons = this.props.actionButtons.map((actionButton) => (
			<button
				className='button'
				key={actionButton.text} 
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
				className={styles.jumboStyle}
				style={this.props.style}
			>
				<div className={styles.jumboInfo}>
					<img
						alt='none'
						src={this.props.imageUrl}
						className={styles.jumboBrand}
						style={this.props.imgStyle}
					/>
					<div className={styles.jumboTextAction}>
						<div className={styles.jumboText}>
							<h1 className={styles.jumboTitle}>
								{this.props.title}
							</h1>
							<p>{this.props.description}</p>
						</div>
						{ this.renderActionButtons() }
					</div>
				</div>
			</div>
		);
	}
}


/**
 * Default props for the storybook render
 * @type {Object}
 */
Jumbotron.defaultProps = {
	imageUrl: 'images/ax.png',
	style: {
		backgroundImage: "url('images/dark-triangles.png')",
		backgroundRepeat: 'repeat',
		color: 'white'
	},
	title: 'Sample Jumbotron',
	description: 'Sample description. Put some stuff here to describe what the site is',
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
}

export default Jumbotron;
