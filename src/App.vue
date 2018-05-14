<template>
  <div id="app">
    <pp-header></pp-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    ppHeader: Header
  }
}
</script>

<style>

</style>
