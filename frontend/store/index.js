import {User} from '../types/User'

// state
export const state = () => ({
	friends: [],
	activeComponent: 'Login',
	twoFA: false,
	currentUser: User,
	version: '',
	loginFinish: false,
})


// getters
export const getters = {
	getActiveComponent (state) {
		return (state.activeComponent)
	}
}

// actions (asynchrone)
export const actions = {
}

// mutations (synchrone)
export const mutations = {
	initialiseStore(state) {
		if(localStorage.getItem('currentUser')) {
			state.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		}
		if(localStorage.getItem('loginFinish')) {
			state.loginFinish = localStorage.getItem('loginFinish');
		if(localStorage.getItem('twoFA')) {
			state.twoFA = true;
		}
}
	},
	changeActiveComponent(state,component) {
		state.activeComponent = component
	},
	getCurrentUser(state, newUser) {
		state.currentUser.avatar = newUser.avatar;
		state.currentUser.id = newUser.id;
		state.currentUser.nickname = newUser.nickname;
		state.currentUser.accessToken = newUser.accessToken;
		localStorage.setItem('currentUser', JSON.stringify(newUser));
		console.log('finished login');
	},
	deleteUser(state) {
		state.currentUser.avatar = '';
		state.currentUser.id = 0;
		state.currentUser.nickname = '';
		state.currentUser.accessToken = '';
		state.loginFinish = false;
		localStorage.removeItem('loginFinish');
		localStorage.removeItem('currentUser');
	},
	change2faStatus(state) {
		if (!state.twoFA)
			localStorage.setItem('twoFA', true);
		else
			localStorage.removeItem('twoFA');
		state.twoFA = !state.twoFA;
	},
	changeLoginFinish(state, newLoginValue) {
		state.loginFinish = newLoginValue;
		localStorage.setItem('loginFinish', newLoginValue);
	},
}