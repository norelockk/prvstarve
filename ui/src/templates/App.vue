<template>
  <div id="new_ui">
    <Netgraph />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';

import Netgraph from './components/Netgraph.vue';

export default Vue.extend({
  components: {
    Netgraph
  }
});
</script>