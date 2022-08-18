import axios from 'axios'


// state
export const state = () => ({
<<<<<<< HEAD
	// friends: [],
	activeComponent: 'LoginPage',
=======
	friends: [],
	activeComponent: 'Login',
>>>>>>> refs/remotes/origin/ben
	// activeComponent: 'MainMenu'
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
	}
}