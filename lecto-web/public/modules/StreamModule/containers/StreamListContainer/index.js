import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { streamActions } from '../../widgets';
import styles from './style.css';

class StreamListContainer extends Component {
	componentDidMount() {
		this.props.fetchStreams(this.props.firebase);
	}
	renderInProgress() {
		if (this.props.inProgress.length <= 0) {
			return <div />;
		}
		const inProgressStreams = this.props.inProgress.map((stream) => (
			<div
				className={styles.streamItem}
				key={`${stream.streamId}progress`}
				onClick={() => {
					browserHistory.push('/streams/room');
					this.props.setStream(stream.streamId);
				}}
			>
				<h4>{stream.name}</h4>
				<p>{stream.description}</p>
			</div>
		));
		return (
			<div className={styles.outerWrap}>
				<h1>In Progress</h1>
				<div className={styles.streamList}>
					{ inProgressStreams }
				</div>
			</div>
		);
	}

	renderUpcoming() {
		if (this.props.upcoming.length <= 0) {
			return <div />;
		}
		const upcomingStreams = this.props.upcoming.map((stream) => (
			<div
				className={styles.streamItem}
				key={`${stream.streamId}upcoming`}
				onClick={() => {
					browserHistory.push('/streams/room');
					this.props.setStream(stream.streamId);
				}}
			>
				<h4>{stream.name}</h4>
				<p>{stream.description}</p>
			</div>
		));
		return (
			<div className={styles.outerWrap}>
				<h1>Upcoming</h1>
				<div className={styles.streamList}>
					{ upcomingStreams }
				</div>
			</div>
		);
	}
	render() {
		return (
			<div>
				{ this.renderInProgress() }
				<hr />
				{ this.renderUpcoming() }
			</div>
		);
	}
}

const toArray = (streams) => {
	if (streams) {
		const newStreams = [];
		Object.keys(streams).forEach((streamerId) => {
			/** don't show any inactive streams */
			if (!streams[streamerId].inactive) {
				newStreams.push(streams[streamerId]);
			}
		});
		return newStreams;
	}
	return [];
};

const mapStateToProps = (state) => ({
	inProgress: toArray(state.streams.allStreams),
	upcoming: []
});

export default connect(mapStateToProps, streamActions)(StreamListContainer);

StreamListContainer.defaultProps = {
	inProgress: [{
		streamId: 1,
		name: 'Stream 1',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 4,
		streamerName: 'Streamer 1'
	}, {
		streamId: 2,
		name: 'Stream 2',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 3,
		streamerName: 'Streamer 2'
	}, {
		streamId: 3,
		name: 'Stream 3',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 2,
		streamerName: 'Streamer 3'
	}, {
		streamId: 4,
		name: 'Stream 4',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 4,
		streamerName: 'Streamer 4'
	}],
	upcoming: [{
		streamId: 1,
		name: 'Stream 1',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 4,
		streamerName: 'Streamer 1'
	}, {
		streamId: 2,
		name: 'Stream 2',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 3,
		streamerName: 'Streamer 2'
	}, {
		streamId: 3,
		name: 'Stream 3',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 2,
		streamerName: 'Streamer 3'
	}, {
		streamId: 4,
		name: 'Stream 4',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 4,
		streamerName: 'Streamer 4'
	}, {
		streamId: 5,
		name: 'Stream 1',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 4,
		streamerName: 'Streamer 1'
	}, {
		streamId: 6,
		name: 'Stream 2',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 3,
		streamerName: 'Streamer 2'
	}, {
		streamId: 7,
		name: 'Stream 3',
		description: `
			Lorem ipsum dolor sit amet, consectetur adipiscing 
			elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam,
		`,
		rating: 2,
		streamerName: 'Streamer 3'
	}]
};

