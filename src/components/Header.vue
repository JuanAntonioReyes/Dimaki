<template>
	<!-- CHANGE THIS TO BOOTSTRAP VUE NOTATION -->
	<header class="row">
		<nav class="navbar navbar-toggleable-md navbar-li">	
			<a href="/" class="navbar-brand">Dimakí</a>
			<ul class="nav">
				<router-link :to="{ name: 'messagesLink' }" tag="li" class="nav-item">
					<a href="" class="nav-link">Messages</a>
				</router-link>
				<router-link :to="{ name: 'newMessageLink' }" tag="li" class="nav-item">
					<a href="" class="nav-link">New message!</a>
				</router-link>
				<strong v-if="loggedUser">
					<a href="" class="nav-link" @click="logout">Logout</a>
				</strong>
				<strong v-else>
					<router-link :to="{ name: 'loginLink' }" tag="li" class="nav-item">
						<a href="" class="nav-link">Login</a>
					</router-link>
				</strong>
				</strong>
			</ul>
		</nav>
	</header>
</template>

<script>

	export default {
		data() {
			return {
				loggedUser: false
			}
		},
		created() {
			if (localStorage.getItem("userToken")) {
				this.loggedUser = true;
			}
		},
		methods: {
			logout() {
				localStorage.removeItem("userToken");
				console.log("LOGGED OUT");
			}
  	}
	}

</script>
