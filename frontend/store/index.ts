import axios from 'axios'
import {User} from '../types/User'

// state
export const state = () => ({
	friends: [],
	currentUser: User,
	version: '',
	
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
	getCurrentUser(state : any, newUser : any) {
		state.currentUser.avatar = newUser.avatar;
		state.currentUser.id = newUser.id;
		state.currentUser.success = newUser.success;
		state.currentUser.nickname = newUser.Nickname;
		localStorage.setItem('currentUser', JSON.stringify(newUser));
	},
	deleteUser(state : any) {
		state.currentUser.avatar = '';
		state.currentUser.id = 0;
		state.currentUser.success = 0;
		state.currentUser.nickname = '';
		localStorage.removeItem('currentUser');
	},
}