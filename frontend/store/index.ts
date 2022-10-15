import {User} from '../types/User'
import * as Colyseus from 'colyseus.js'

// state
export const state = () => ({
	friends: [],
	activeComponent: 'Login',
	myMainRoom: Colyseus.Room,
	currentUser: User,
	tmpID: 0,
	version: '',
	noBall: true,
	loginFinish: false,
	gameOption: { ballSpeed: 0, paddleSpeed: 0, pointsToWin: 0, color: '', idPlayer: 0},
	historyId: 0,
})


// getters
export const getters = {
	getActiveComponent (state : any) {
		return (state.activeComponent)
	},
	getCurrentUser: (state : any) => {
		const user = new User();
		user.avatar = state.currentUser.avatar;
		user.nickname = state.currentUser.nickname;
		user.id = state.currentUser.id;
		user.accessToken = state.currentUser.accessToken;
		user.status = state.currentUser.status;
		user.twoFA = state.currentUser.twoFA
		return (user)
	},
	getMainRoom(state: any) {
		return state.myMainRoom;
	}
}

// actions (asynchrone)
export const actions = {
}

// mutations (synchrone)
export const mutations = {
	initialiseStore(state : any) {
		if(localStorage.getItem('currentUser')) {
			state.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
		}
		if(localStorage.getItem('loginFinish')) {
			state.loginFinish = localStorage.getItem('loginFinish');
}
	},
	changeActiveComponent(state : any,component : any) {
		state.activeComponent = component
	},
	changeNoBall(state : any, value : Boolean) {
		state.noBall = value
	},
	changeNickname(state : any, newNick : any) {
		state.currentUser.nickname = newNick;
		let newUser = JSON.parse(localStorage.getItem('currentUser'));
		newUser.nickname = newNick;
		localStorage.setItem('currentUser', JSON.stringify(newUser));
	},
	changeStatus(state : any, newStatus : string) {
		state.currentUser.status = newStatus;
	},
	changeAvatar(state : any, newAvatar : any) {
		state.currentUser.avatar = newAvatar;
		let newUser = JSON.parse(localStorage.getItem('currentUser'));
		newUser.avatar = newAvatar;
		localStorage.setItem('currentUser', JSON.stringify(newUser));
	},
	changeTmpID(state : any, newID : any) {
		state.tmpID = newID;
	},
	setCurrentUser(state : any, newUser : any) {
		state.currentUser.avatar = newUser.avatar;
		state.currentUser.id = newUser.id;
		state.currentUser.nickname = newUser.nickname;
		state.currentUser.accessToken = newUser.accessToken;
		state.currentUser.twoFA = newUser.twoFA;
		localStorage.setItem('currentUser', JSON.stringify(newUser));
		console.log('finished login');
	},
	deleteUser(state : any) {
		state.currentUser.avatar = '';
		state.currentUser.id = 0;
		state.currentUser.nickname = '';
		state.currentUser.accessToken = '';
		state.currentUser.twoFA = false;
		state.loginFinish = false;
		localStorage.removeItem('loginFinish');
		localStorage.removeItem('currentUser');
	},
	change2faStatus(state, value) {
		state.currentUser.twoFA = value;
		let newUser = JSON.parse(localStorage.getItem('currentUser'));
		newUser.twoFA = value;
		localStorage.setItem('currentUser', JSON.stringify(newUser));
	},
	changeLoginFinish(state, newLoginValue) {
		state.loginFinish = newLoginValue;
		localStorage.setItem('loginFinish', newLoginValue);
	},
	changeGameOption(state, newOption) {
		state.gameOption.ballSpeed = newOption.ballSpeed;
		state.gameOption.paddleSpeed = newOption.paddleSpeed;
		state.gameOption.pointsToWin = newOption.pointsToWin;
		state.gameOption.color = newOption.color;
	},
	changeGameUserId(state, id) {
		state.gameOption.idPlayer = id;
	},
	changeHistoryId(state, id) {
		state.historyId = id;
	},
	setMainRoom(state, newMainRoom: Colyseus.Room) {
		state.myMainRoom = newMainRoom
	},
}