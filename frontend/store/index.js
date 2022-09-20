import axios from 'axios'
import {User} from '../types/User'
import {version} from '../package.json';

// state
export const state = () => ({
	friends: [],
	activeComponent: 'Login',
	twoFA: false,
	currentUser: User,
	version: '',
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
		if(localStorage.getItem('twoFA')) {
			state.twoFA = true;
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
	},
	deleteUser(state) {
		state.currentUser.avatar = '';
		state.currentUser.id = 0;
		state.currentUser.nickname = '';
		localStorage.removeItem('currentUser');
	},
	change2faStatus(state) {
		if (!state.twoFA)
			localStorage.setItem('twoFA', true);
		else
			localStorage.removeItem('twoFA');
		state.twoFA = !state.twoFA;
	}
}