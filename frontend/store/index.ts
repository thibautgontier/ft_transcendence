import {User} from '../types/User'

// state
export const state = () => ({
	friends: [],
	activeComponent: 'Login',
	twoFA: false,
	currentUser: User,
	tmpID: 0,
	version: '',
	inMenu: true,
	loginFinish: false,
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
		if(localStorage.getItem('loginFinish')) {
			state.loginFinish = localStorage.getItem('loginFinish');
		if(localStorage.getItem('twoFA') === 'true') {
			state.twoFA = true;
		}
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
		console.log('finished login');
	},
	deleteUser(state : any) {
		state.currentUser.avatar = '';
		state.currentUser.id = 0;
		state.currentUser.nickname = '';
		state.currentUser.accessToken = '';
		state.loginFinish = false;
		localStorage.removeItem('loginFinish');
		localStorage.removeItem('currentUser');
	},
	change2faStatus(state, value) {
		state.twoFA = value;
		localStorage.setItem('twoFA', JSON.stringify(value));
	},
	changeLoginFinish(state, newLoginValue) {
		state.loginFinish = newLoginValue;
		localStorage.setItem('loginFinish', newLoginValue);
	},
}