<style scoped>
.modal {
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
  z-index: 9999999;
}

.modal .content {
  position: relative;
  background: rgba(25, 25, 25, 0.9);
  width: 45vw;
  height: auto;
  border-radius: 5px;
  border: 1px solid #353535;
  overflow: hidden;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: msganim .5s ease;
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

.modal .content a.close {
  position: absolute;
  top: 40px;
  right: 40px;
  font-size: 24px;
  color: #d4d4d4;
  opacity: .6;
  text-decoration: none;
  line-height: 0;
  transition: all .3s;
}

.modal .content a.close:hover {
  opacity: 1;
}

.modal .content h1 {
  margin: 0;
  font-weight: 500;
  font-size: 42px;
  width: 80%;
  margin-bottom: 50px;
}

.modal .content div.details {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
}

.modal .content div.defs {
  display: inline-block;
}

.modal .content div.defs div {
  font-size: 14px;
  display: block;
  padding: 10px 0;
}

.modal .content div.defs div h3 {
  display: inline-block;
  margin: 0;
  text-transform: uppercase;
  font-size: 14px;
  opacity: .7;
  letter-spacing: 1px;
  font-weight: 500;
  margin-right: 5px;
}

.modal .content div.defs div span {
  font-size: 12px;
  opacity: .5;
}

.modal .content div.desc,
.modal .content div.desc p {
  display: inline-block;
}

.modal .content div.desc {
  width: 65%;
  max-height: 200px;
  overflow-y: auto;
}

.modal .content div.desc p {
  font-size: 14px;
  line-height: 25px;
  margin: 0;
}

.modal .content .password {
  display: inline-block;
  width: 200px;
  margin-right: 20px;
  background: none;
  border: none;
  border-bottom: 2px solid #d4d4d4;
  color: #d4d4d4;
  opacity: .6;
}

.modal .content a.connect {
  display: inline-block;
  width: 200px;
  font-size: 17px;
  color: #d4d4d4;
  opacity: .6;
  text-decoration: none;
  line-height: 0;
  transition: all .3s;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
  margin: 0;
  margin-bottom: 10px;
}

.modal .content a.connect i {
  font-size: 24px;
  position: relative;
  top: 5px;
}

.modal .content a.connect:hover {
  opacity: 1;
}

.modal .content div.desc::-webkit-scrollbar-button {
  display: none;
}

.modal .content div.desc::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, .4);
}

.modal .content div.desc::-webkit-scrollbar-thumb:hover {
  background-color: #CCC;
}

.modal .content div.desc::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, .08);
}

.modal .content div.desc::-webkit-scrollbar {
  width: 3px;
  position: absolute;
  transition: all .3s;
}

@media screen and (min-width: 3839px),
(min-height: 2159px) {
  .modal .content {
    width: 22.5vw;
    height: 25vh;
  }
}

@media screen and (max-width: 1366px),
(max-height: 768px) {
  .modal .content h1 {
    font-size: 32px;
  }

  .modal .content div.defs div h3,
  .modal .content div.defs div {
    font-size: 12px;
  }

  .modal .content div.defs div {
    padding: 7px 0;
  }

  .modal .content div.desc p {
    font-size: 12px;
  }

  .modal .content a.connect {
    font-size: 15px;
  }

  .modal .content a.connect i {
    font-size: 22px;
  }
}

@media screen and (max-width: 1280px),
(max-height: 720px) {
  .modal .content {
    padding: 30px;
  }

  .modal .content a.close {
    top: 30px;
    right: 30px;
  }

  .modal .content div.defs div {
    padding: 5px 0;
  }
}

@media screen and (max-width: 1152px),
(max-height: 727px) {
  .modal .content {
    width: 55vw;
  }
}

@media screen and (max-width: 800px),
(max-height: 600px) {
  .modal .content {
    width: 75vw;
  }

  .modal .content a.close {
    top: 30px;
    right: 30px;
  }
}
</style>

<template>
  <div class="modal" @click.self="M_close">
    <div class="content">
      <a class="close" @click="M_close">
        <span class="ic-cross"></span>
      </a>

      <div v-if="!__isStrEmpty($props.description)" class="desc">
        <p v-text="$props.description"></p>
      </div>
      <h1 v-if="!__isStrEmpty($props.title)" v-text="$props.title"></h1>
    
      <div class="details" v-if="$props.defs.length > 0">
        <div class="defs">
          <div v-for="(def, i) in $props.defs" :key="i">
            <h3 v-text="def.title"></h3>
            <span v-text="def.text"></span>
          </div>
        </div>
      </div>

      <a class="connect" @click="M_connect" v-if="!__isStrEmpty($props.serverId)">
        <i class="ic-media-play"></i>
        <span>Connect</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { destroyMessage, showMessage } from '@/uiCalls';
import { get } from '../../utils';
import env from '@/env';

export default Vue.extend({
  props: {
    serverId: {
      type: String,
      default: '',
      required: false,
    },
    defs: {
      type: Array,
      default: () => ([]),
      required: false
    },
    title: {
      type: String,
      default: 'Modal title',
      required: false,
    },
    identifier: {
      type: String,
      default: '',
      required: true
    },
    description: {
      type: String,
      default: 'Modal description',
      required: false
    }
  },
  methods: {
    __isStrEmpty(str: string) {
      str = str.trim();

      return str.length === 0 || str === '';
    },
    M_close() {
      return this.$store.dispatch('modals/destroy', this.$props.identifier);
    },
    async M_connect() {
      if (!this.__isStrEmpty(this.$props.serverId) && typeof this.$props.serverId === 'string') {
        // Destroy current modal
        this.M_close();

        // Display connecting message with retriving server data
        showMessage({
          description: 'Retrieving server data..',
          identifier: 'DOWNLOAD_SERVER_DATA',
          progress: {
            show: true,
            fill: 0
          },
          title: 'Connecting',
          actions: []
        });

        // Get server data
        const SERVER_INFO = await get(`${env.LOLIPOP_LOBBY_URL}/server/${this.$props.serverId}`);
        if (SERVER_INFO) {
          if ('LOLIPOP_SELECTED_SERVER' in window && window['LOLIPOP_SELECTED_SERVER'] !== SERVER_INFO) window['LOLIPOP_SELECTED_SERVER'] = SERVER_INFO;
          if ('client' in window) window.client.connect();
        } else if (!SERVER_INFO.ok) {
          destroyMessage('DOWNLOAD_SERVER_DATA');
        }
      }
    },
  },
});
</script>