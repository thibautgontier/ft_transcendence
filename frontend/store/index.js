import axios from 'axios'
import {User} from '../types/User'

// state
export const state = () => ({
	friends: [],
	activeComponent: 'Login',
	activeComponent: 'MainMenu',
	currentUser: User,
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
	changeActiveComponent(state,component) {
		state.activeComponent = component
		console.log()
	},
	getCurrentUser(state, newUser) {
		state.currentUser.photo = newUser.avatar;
		state.currentUser.id = newUser.id;
		state.currentUser.success = newUser.success;
		console.log('get user:', state.currentUser.id);
	},
	deleteUser(state) {
		state.currentUser.photo = '';
		state.currentUser.id = 0;
		state.currentUser.success = 0;
		console.log('store: ', state.currentUser.id);
	},
}
