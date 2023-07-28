<style scoped>
.annoucement {
  position: absolute;
  height: 24px;
  padding-top: 5px;
  font-size: 14px;
  font-weight: 200;
  color: #fff;
  background: rgba(39, 39, 39, 0.75);
  backdrop-filter: blur(50px);
  z-index: 99999999;
}

.a-active-enter-active, .a-active-leave-active {
  transition: opacity 3s;
}
.a-active-enter, .a-active-leave-to {
  opacity: 0;
}
</style>

<template>
  <transition name='a-active' mode='out-in'>
    <div class='annoucement' v-if='$props.show'>
      <MQT :duration="25">
        <span v-text='$props.text'></span>
      </MQT>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

// Dependencies
import MQT from './dependencies/MQT.vue';

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: 'This is an annoucement text. It is a just a normal text.',
      required: false
    },
    show: {
      type: Boolean,
      default: false,
      required: false,
    }
  },
  methods: {
    async A_init() {
      const sound = await require('../../assets/media/ann.mp3');

      if (sound) {
        const audio = new Audio(sound);

        if (audio) {
          audio
          .play()
          .then(() => {
            audio.volume = 0.8;
          });
        }
      }
    }
  },
  components: {
    MQT
  },
  created() {
    this.A_init();
  },
});
</script>