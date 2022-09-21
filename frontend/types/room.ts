import * as Colyseus from "colyseus.js";

export interface IRoom {
	channel: Colyseus.Room,
	channelName: string,
	messages: Message[],
	id : number
	Type: chanStatus,
	members: [],
};

export class ourRoom implements IRoom {
	channel = new Colyseus.Room('');
	channelName = '';
	messages : Message[] = [];
	id = 0;
	Type= chanStatus.PUBLIC;
	members = {} as any;
};

export enum chanStatus {
	PUBLIC = "public",
	PROTECTED = "protected", //if mdp exist
	PRIVATE = "private" // invisible
  }

  export interface Imessage {
	id: number
	CreatedAt: Date,
	UpdatedAt: Date,
	Content: string,
	Nickname: string,
}

export class Message implements Imessage {
	id = 0;
	CreatedAt = new Date();
	UpdatedAt = new Date();
	Content = '';
	Nickname = '';
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

  export interface IChatRoomMessage {
	Content: string,
	Nickname: string,
}

export class ChatRoomMessage implements IChatRoomMessage {
	Content = '';
	Nickname = '';
}