// import * as Colyseus from "colyseus.js";

export interface IRoom {
	// channel: Colyseus.Room,
	users: string[],
	messages: string[],
	date: Date,
	update_at: Date,
	publicChannel: boolean,
	password: string,
	adminUsers: string[],
	owner: string,
	authPrivateChannelUsers: string[],
	directMessage: boolean,
};

export class Room implements IRoom {
	// channel = Colyseus.Room.constructor,
	users = [];
	messages = [];
	date = new Date();
	update_at = new Date();
	publicChannel = false;
	password = '';
	adminUsers = [];
	owner = '';
	authPrivateChannelUsers = [];
	directMessage = false;
};