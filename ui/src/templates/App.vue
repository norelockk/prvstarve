<template>
  <div id="new_ui">
    <Netgraph />
    <Watermark />
    <Console />
  </div>
</template>

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