<template>
  <div id="app">
		<b-container fluid class="mt-2 mb-3" tag="header">
			<pp-header :userLogged="userLogged" @logout="onLoginLogout"></pp-header>
		</b-container>
    
    <b-container>
      <router-view @login="onLoginLogout"></router-view>
    </b-container>
    
		<b-container fluid class="mt-4" tag="footer">
			<pp-footer></pp-footer>
		</b-container>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {

  data() {
    return {
      userLogged: false
    }
  },

  components: {
    ppHeader: Header,
    ppFooter: Footer
  },

  mounted() {
    if (localStorage.getItem("userToken") !== null) {
      this.userLogged = true;
    }
  },

  methods: {
    onLoginLogout(loginValue) {
      this.userLogged = loginValue;
    }
  }

}
</script>

<style>

</style>
