<template>
  <div id="new_ui">
    <Netgraph />
    <Watermark />
    <Console />
  </div>
</template>

<style scoped>
#new_ui {
  width: 100vw;
  height: 100vh;
  display: inline-block;
  z-index: 9999999;
}
</style>

<script lang='ts'>
import Vue from 'vue';

// Components
import Console from './components/Console.vue';
import Netgraph from './components/Netgraph.vue';
import Watermark from './components/Watermark.vue';

export default Vue.extend({
  components: {
    Console,
    Netgraph,
    Watermark
  }
});
</script>