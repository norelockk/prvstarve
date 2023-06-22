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

<script lang='ts'>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { EXECUTE_CONSOLE_CVAR } from '@/consoleCVars';
import { pushConsoleMessage } from '@/uiCalls';

const levelColors: {
  [key: string]: string
} = {
  info: '#0ea2c7',
  warn: '#de6910',
  debug: '#0b87e6',
  error: '#e31025'
};

export default Vue.extend({
  data: () => ({
    C_input: ''
  }),
  methods: {
    C_parseLevelColor(level: string) {
      if (level in levelColors) {
        const color: string = levelColors[level];

        return { color };
      }

      return { color: '#ffffff' };
    },
    async C_executeCommand() {
      // Transpile input to lowercase and remove unecessary more than 1 whitespace
      const input: string = this.C_input.toLowerCase().trim();

      if (input.length > 0) {
        // Extract the arguments from input
        const [commandName, ...args]: any[] = input.split(/ +/);

        // Execute command
        const command = await EXECUTE_CONSOLE_CVAR(commandName, ...args);
        if (!command)
          pushConsoleMessage('error', 'Unknown command');

        // Clear input
        this.C_input = '';
      }
    }
  },
  computed: {
    ...mapGetters({
      showing: 'console/showing',
      messages: 'console/messages'
    })
  }
});
</script>

<template>
  <div class='console' v-show='showing'>
    <p id='c_content'>
      <span v-for='(m, index) in messages' :key='index'>
        <span :style="[C_parseLevelColor(m.level)]" v-text='`[${m.level.toUpperCase()}] `'></span>
        <span v-text='m.message'></span>
        <br />
      </span>
    </p>

    <input id='c_input' type='text' v-model='C_input' v-on:keyup.enter='C_executeCommand' maxlength='500' />
    <div class='mark'>></div>
  </div>
</template>