import axios from 'axios'


// state
export const state = () => ({
	friends: [],
	activeComponent: 'Login',
	activeComponent: 'MainMenu',
	currentUserId: 0
})

// getters
export const getters = {
	getActiveComponent (state) {
		return (state.activeComponent)
	}
}

// actions (asynchrone)
export const actions = {
	// async getFriends() {
	// 	// api call qui renvoie la liste des amis
	// 	const friends = await axios.post("https://randomuser.me/api/?results=10")
	// 	commit("addFriend", friends)
	// 	return friends
	// }
}

// mutations (synchrone)
export const mutations = {
	// addFriends (state, friends) {
	// 	state.friends.push({...friends})
	// },
	changeActiveComponent(state,component) {
		state.activeComponent = component
		console.log()
	},
	getCurrentUserId(state, id) {
		state.currentUserId = id
	}
}
