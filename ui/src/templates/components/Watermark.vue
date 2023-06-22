<style scoped>
.watermark {
  position: absolute;
  bottom: 25px;
  right: 25px;
  display: flex;
  align-items: center;
  z-index: 55555555;
}

.watermark .info {
  color: #fff;
  opacity: .5;
  font-size: 14px;
  text-shadow: 0 0 3px rgba(0, 0, 0, .5);
}

.watermark .info span {
  display: block;
}
</style>

<script lang='ts'>
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters({
      showing: 'ui/showing',
      environment: 'lolipop/environment',
      lolipopData: 'lolipop/project',
    })
  }
});
</script>

<template>
  <div class='watermark' v-if='!showing'>
    <div class='info'>
      <span v-text='`${lolipopData.name} ${lolipopData.version}-${lolipopData.channel}`'></span>
      <span v-text='`Branch: ${environment} / ${lolipopData.hash}`'></span>
    </div>
  </div>
</template>