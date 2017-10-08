/* eslint-disable no-param-reassign, max-len */
import { browserHistory } from 'react-router';

/** <============================================== BASEMODULE CONFIG ==============================================> */
const buttonStyle = { 
	color: 'white',
	marginRight: '10px',
	fontFamily: 'Avenir, sans-serif',

};

const jumboProps = {
	imageUrl: 'http://icons.iconarchive.com/icons/cornmanthe3rd/plex/256/System-webcam-icon.png',
	title: 'Live Streamed Learning',
	description: 'Study smarter by teaching your peers. Make a few bucks on the side',
	style: {
		backgroundImage: "url('/static/images/dark-triangles.png')",
		backgroundRepeat: 'repeat',
		color: 'white'
	},
	actionButtons: [{
		text: 'Browse Streams',
		style: { 
			backgroundColor: '#F22613',
			borderColor: '#F22613',
			...buttonStyle
		},
		onClick: () => browserHistory.push('/streams')
	}]
};

const aboutProps = (window) => ({
	title: 'About This Project',
	description: `Lecto is a live streaming vid chat platform that enables the creation of study groups, live office hours,
	and Q&A sessions. The streams are data driven - we utilize Microsoft Cognitive Services API to determine overall participant
	sentiment about streams, as well as other data analytics tools to gauge stream effectiveness. It was submitted to Calhacks 4.0`,
	actionButtons: [{
		text: 'view on devpost',
		style: { 
			backgroundColor: '#0077B5', 
			borderColor: '#0077B5',
			...buttonStyle
		},
		onClick: () => {
			window.location.href = 'https://devpost.com';
		}
	}, {
		text: 'view on github',
		style: { 
			backgroundColor: 'white', 
			borderColor: 'black',
			color: 'black',
			marginRight: '5px',
			fontFamily: 'Avenir, sans-serif'
		},
		onClick: () => {
			window.location.href = 'https://github.com/david8zhang/lecto';
		}
	}]
});

const baseModuleConfig = { jumboProps, aboutProps, buttonStyle };

export { baseModuleConfig };
