<template>
	<div class="posts">
		<h1>Add Message</h1>

		<div class="form">
			<div>
				<textarea rows="5" cols="20" placeholder="Message text..." v-model="newMessage.text">
				</textarea>
			</div>
			<div>
				<button @click="addMessage">Add</button>
			</div>
		</div>
	</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';

	export default {
		data() {
			return {
				newMessage: {
					latitude: 10,
					longitude: 10,
					text: ''
				}
			}
		},
		methods: {
    	async addMessage() {
    		await apiAccess.addMessage(this.newMessage);

      	this.$router.push({ name: 'messagesLink' })
    	}
  }
}
</script>

<style>
	
</style>