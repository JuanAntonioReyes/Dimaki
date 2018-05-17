<template>
  <div id="app">
		<b-container fluid>
			<pp-header></pp-header>
		</b-container>
    
    <router-view></router-view>
    
		<b-container fluid>
			<pp-footer></pp-footer>
		</b-container>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    ppHeader: Header,
    ppFooter: Footer
  }
}
</script>

<style>

</style>
