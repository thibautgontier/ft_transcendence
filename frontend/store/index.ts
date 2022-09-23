import {User} from '../types/User'

// state
export const state = () => ({
	friends: [],
	currentUser: User,
	tmpID: 0,
	version: '',
	inMenu: true,
})


// getters
export const getters = {
	getActiveComponent (state : any) {
		return (state.activeComponent)
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
	},
	changeActiveComponent(state : any,component : any) {
		state.activeComponent = component
	},
	changeInMenu(state : any, value : Boolean) {
		state.inMenu = value
	},
	changeNickname(state : any, newNick : any) {
		state.currentUser.nickname = newNick;
	},
	changeAvatar(state : any, newAvatar : any) {
		state.currentUser.nickname = newAvatar;
	},
	changeTmpID(state : any, newID : any) {
		state.tmpID = newID;
	},
	getCurrentUser(state : any, newUser : any) {
		state.currentUser.avatar = newUser.avatar;
		state.currentUser.id = newUser.id;
		state.currentUser.nickname = newUser.nickname;
		state.currentUser.accessToken = newUser.accessToken;
		localStorage.setItem('currentUser', JSON.stringify(newUser));
	},
	deleteUser(state : any) {
		state.currentUser.avatar = '';
		state.currentUser.id = 0;
		state.currentUser.nickname = '';
		localStorage.removeItem('currentUser');
	},
}