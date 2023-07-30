<style scoped>
.message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(25, 25, 25, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .3s;
  backdrop-filter: blur(50px);
  z-index: 9999999;
}

@keyframes msganim {
  0% {
    opacity: 0%;
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

.message .content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: msganim .5s ease;
}

.message .content h1 {
  font-size: 52px;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  margin-bottom: 30px;
}

.message .content p {
  margin: 0;
  line-height: 30px;
  text-align: center;
  margin-bottom: 35px;
  font-size: 15px;
}

@keyframes loader {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.message .content div.loader {
  width: 32px;
  height: 32px;
  border-top: 3px solid rgba(255, 255, 255, .6);
  border-left: 3px solid rgba(255, 255, 255, .6);
  border-right: 3px solid rgba(0, 0, 0, 0);
  border-bottom: 3px solid rgba(0, 0, 0, 0);
  border-radius: 100px;
  animation: loader 1.5s linear infinite;
  margin-bottom: 35px;
}

.message .content a {
  font-size: 14px;
  color: #d4d4d4;
  opacity: .6;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 0;
  transition: all .3s;
}

.message .content a:hover {
  opacity: 1;
}

.message .content .progress {
  margin-bottom: 40px !important;
  width: 15em;
  height: 5px;
  background: hsla(0, 0%, 100%, .2);
  border-radius: 100px;
  overflow: hidden;
  position: relative;
  margin: 1em 0;
}

@-webkit-keyframes loading-prefill {
  0% {
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }

  to {
    -webkit-transform: translateX(200%);
    transform: translateX(200%);
  }
}

@keyframes loading-prefill {
  0% {
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }

  to {
    -webkit-transform: translateX(200%);
    transform: translateX(200%);
  }
}

.message .content .progress:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: hsla(0, 0%, 100%, .1);
  border-radius: 100%;
  -webkit-animation: loading-prefill 1s ease infinite;
  animation: loading-prefill 1s ease infinite;
}

.message .content .progress .fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transition: all 0.4s;
  background: #cecece;
  border-radius: 100px;
}

.message .content .progress .fill.no-transition {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  transition: none !important;
}

.message .content .text input {
  background: rgba(255, 255, 255, .05);
  border: 0;
  border-bottom: 2px solid rgba(255, 255, 255, .5);
  padding: 10px;
  color: #eee;
  margin-bottom: 35px;
}

.message .content .text input::selection {
  background: #eee;
  color: #222;
}
</style>

<template>
  <div class="message">
    <div class="content">
      <h1 v-if="!__isStrEmpty($props.title)" v-text="$props.title"></h1>
      <div class="progress" v-if="$props.progress.show">
        <div class="fill" :style="[M_progressStyle]"></div>
      </div>
      <div class="loader" v-if="$props.loading"></div>
      <p v-if="!__isStrEmpty($props.description)" v-text="$props.description"></p>
      <div class="actions" v-if="$props.actions.length > 0">
        <a v-for="(action, index) in $props.actions" :key="index" @click="action.callback" v-text="action.text"></a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: 'Message title',
      required: false,
    },
    actions: {
      type: Array,
      default: () => ([
        {
          text: 'Cancel',
          callback: () => {
            console.log('cancel working')
          }
        }
      ]),
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false,
    },
    progress: {
      type: Object,
      default: () => ({
        show: false,
        fill: 0
      }),
      required: false,
    },
    description: {
      type: String,
      default: 'Message description',
      required: false,
    },
  },
  methods: {
    __isStrEmpty(str: string) {
      str = str.trim();

      return str.length === 0 || str === '';
    },
  },
  computed: {
    M_progressStyle() {
      const __this = this;

      return {
        width: `${__this.$props.progress.fill}%`
      }
    }
  },
})
</script>