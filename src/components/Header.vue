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
					<a href="" class="nav-link">New message</a>
				</router-link>
			</ul>
		</nav>
	</header>
</template>