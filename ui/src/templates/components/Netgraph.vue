<style scoped>
.netgraph {
  font-weight: 500;
  color: #fff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 1);
  font-size: 12px;
  position: absolute;
  bottom: 25px;
  left: 25px;
  user-select: none;
  z-index: 99999;
}
</style>

<script lang='ts'>
import { humanizeNetworkBandwidth } from '@/utils';

import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  data: () => ({
    KEYS_TRANSLATION: {
      frames: 'FPS',
      networkIn: 'Network receive',
      networkOut: 'Network sent'
    } as {
      [key: string]: any
    }
  }),
  computed: {
    ...mapGetters({
      N_data: 'netgraph/data',
      N_showing: 'netgraph/showing'
    })
  },
  methods: {
    N_translateKey(key: any) {
      return `${this.KEYS_TRANSLATION[key]}:`;
    },
    N_translateValue(key: any) {
      if (key.startsWith('network'))
        return humanizeNetworkBandwidth(this.N_data[key]);

      return this.N_data[key];
    }
  }
});
</script>

<template>
  <table class='netgraph' v-if='N_showing'>
    <tr v-for='(index, key) of N_data'>
      <td v-text='N_translateKey(key)'></td>
      <td v-text='N_translateValue(key)'></td>
    </tr>
  </table>
</template>