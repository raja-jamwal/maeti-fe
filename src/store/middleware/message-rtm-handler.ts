import { addRtmHandler, RTMHandlerCallback } from './rtm-middleware';

export const messageRtmHandler: RTMHandlerCallback = (_store: any, payload) => {
	console.log('new message ', payload);
	return;
};

addRtmHandler('message', messageRtmHandler);
