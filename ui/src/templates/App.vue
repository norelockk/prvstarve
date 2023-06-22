<template>
  <div id="new_ui">
    <Netgraph />
    <Watermark />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';

import Netgraph from './components/Netgraph.vue';
import Watermark from './components/Watermark.vue';

export default Vue.extend({
  components: {
    Netgraph,
    Watermark
  }
});
</script>