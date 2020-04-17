import { getLogger } from 'src/utils/logger';

export function SlackPostMessage(message = '') {
	const logger = getLogger(SlackPostMessage);
	logger.log(`Slack => ${message}`);
	return fetch('https://slack.com/api/chat.postMessage', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer xoxb-420952665250-977737964433-pN1hC9t4LyFRSshQjai0t1Al',
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			channel: 'GV1R0PW3X',
			text: message
		})
	});
}
