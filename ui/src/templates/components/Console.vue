<style scoped>
.console {
  height: 35vh;
  width: 100vw;
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, .8);
  font-family: 'Ubuntu Mono', monospace;
  font-weight: 400;
  border: 1px solid rgba(255, 255, 255, .2);
}

.console p {
  margin: 0;
  line-height: 20px;
  height: calc(100% - 35px);
  width: 100%;
  white-space: pre-wrap;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 20px;
  user-select: text;
  font-size: 15px;
}

.console p::selection,
.console input::selection {
  background: #fff;
  color: #000;
}

.console input {
  width: 100%;
  height: 35px;
  border: 0;
  box-sizing: border-box;
  padding: 10px 20px;
  padding-bottom: 13px;
  font-family: monospace;
  background: none;
  color: #fff;
  border-top: 1px solid rgba(255, 255, 255, .2);
  padding-left: 40px;
}

.console .mark {
  position: absolute;
  bottom: 10px;
  left: 20px;
  font-size: 16px;
  font-weight: 700;
}

.console p::-webkit-scrollbar-button {
  display: none;
}

.console p::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, .4);
}

.console p::-webkit-scrollbar-thumb:hover {
  background-color: #CCC;
}

.console p::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, .08);
}

.console p::-webkit-scrollbar {
  width: 3px;
  position: absolute;
  transition: all .3s;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters({
      showing: 'console/showing',
      messages: 'console/messages'
    })
  }
})
</script>

<template>
  <div class='console' v-if='showing'>
    <p>
      <span v-for="(m, index) in messages" :key="index">
        <span v-text='`[${m.level.toUpperCase()}] `'></span>
        <span v-text='m.message'></span>
        <br />
      </span>
    </p>

    <input type='text' />
    <div class='mark'>></div>
  </div>
</template>