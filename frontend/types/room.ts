import * as Colyseus from "colyseus.js";

export interface IRoom {
	channel: Colyseus.Room,
	channelName: string,
	messages: Message[],
	id : number
};

export class ourRoom implements IRoom {
	channel = new Colyseus.Room('');
	channelName = '';
	messages : Message[] = [];
	id = 0;
};

export enum chanStatus {
	PUBLIC = "public",
	PROTECTED = "protected",
	PRIVATE = "private"
  }

  export interface Imessage {
	id: number
	CreatedAt: Date,
	UpdatedAt: Date,
	Content: string,
	// UserID: number,
}

export class Message implements Imessage {
	id = 0;
	CreatedAt = new Date();
	UpdatedAt = new Date();
	Content = '';
	// UserID = 0;
}

export interface Ichannel {
	ChannelNotifyID: string,
	CreatedAt: Date,
	Description: string,
	Name: string,
	OwnerID: number,
	Password: string,
	Type: chanStatus,
	UpdatedAt: Date,
	id: number,
	RoomId: String,
	Messages: Message[];
  }

  export class Channel implements Ichannel {
	ChannelNotifyID = '';
	CreatedAt = new Date();
	Description = '';
	Name = '';
	OwnerID = 0;
	Password = '';
	Type = chanStatus.PUBLIC;
	UpdatedAt = new Date();
	id = 0;
	RoomId = '';
	Messages: Message[] = [];
  }