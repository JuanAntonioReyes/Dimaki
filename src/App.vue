<template>
  <div id="app">
		<b-container fluid class="mt-2 mb-4" tag="header">
			<pp-header></pp-header>
		</b-container>
    
    <b-container>
      <router-view></router-view>
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
  components: {
    ppHeader: Header,
    ppFooter: Footer
  }
}
</script>

<style>

</style>
