import * as Colyseus from 'colyseus.js'
import { User } from './User'

export interface IRoom {
  channel: Colyseus.Room
  channelName: string
  messages: Message[]
  id: number
  Type: chanStatus
  members: User[]
}

export class OurRoom implements IRoom {
  channel = new Colyseus.Room('')
  channelName = ''
  messages: Message[] = []
  id = 0
  Type = chanStatus.PUBLIC
  members: User[] = []
}

export enum chanStatus {
  PUBLIC = 'public',
  PROTECTED = 'protected', //if mdp exist
  PRIVATE = 'private', // only dm into two user
}

export interface Imessage {
  id: number
  CreatedAt: Date
  UpdatedAt: Date
  Content: string
  Nickname: string
  idSender: number
}

export class Message implements Imessage {
  id = 0
  CreatedAt = new Date()
  UpdatedAt = new Date()
  Content = ''
  Nickname = ''
  idSender = 0
}

export interface Ichannel {
  ChannelNotifyID: string
  CreatedAt: Date
  Description: string
  Name: string
  OwnerID: number
  Type: chanStatus
  UpdatedAt: Date
  id: number
  RoomId: String
  Messages: Message[]
  active: boolean
  inputPassword: string
}

export class Channel implements Ichannel {
  ChannelNotifyID = ''
  CreatedAt = new Date()
  Description = ''
  Name = ''
  OwnerID = 0
  Type = chanStatus.PUBLIC
  UpdatedAt = new Date()
  id = 0
  RoomId = ''
  Messages: Message[] = []
  active = false
  inputPassword = ''
}

export interface IChatRoomMessage {
  Content: string
  Nickname: string
}

export class ChatRoomMessage implements IChatRoomMessage {
  Content = ''
  Nickname = ''
}

export interface ISanction {
  id: number;
  Type: string;
  Reason: string;
  UserName: string;
  Duration: number;
}

export class Sanction implements ISanction {
  id = 0;
  Type = "";
  Reason = "";
  UserName = "";
  Duration = 0;
}