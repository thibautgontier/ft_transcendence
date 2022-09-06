import * as Colyseus from "colyseus.js";

export interface IRoom {
	channel: Colyseus.Room,
	channelName: string,
	messages: string[],
};

export class ourRoom implements IRoom {
	channel = new Colyseus.Room('');
	channelName = '';
	messages : string[] = [];
};