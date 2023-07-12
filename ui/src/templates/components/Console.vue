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
    C_input: '',
    C_historyIndex: 0,
  }),
  watch: {
    showing(n) {
      const __this = this;
      const input: HTMLInputElement = __this.$refs.C_input as HTMLInputElement;

      if (n && !!input) {
        __this.$nextTick(() => input.focus());
      }
    },
    messages(n) {
      const __this = this;
      const content: HTMLElement = __this.$refs.C_content as HTMLElement;

      if (n.length && content) {
        content.scrollTop = content.scrollHeight;
      }
    }
  },
  methods: {
    // native fixes
    __fixNativeInput(e: KeyboardEvent) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        this.__fixNativeDelete();
        return e.preventDefault();
      }
    },
    __fixNativeDelete() {
      const __this = this;

      if (__this.C_input.length > 0) __this.C_input = __this.C_input.substring(0, __this.C_input.length - 1);
    },
    C_style() {
      const __this = this;

      return {
        display: __this.showing ? 'inline-block' : 'none',
        zIndex: 9999999
      }
    },
    C_parseLevelColor(level: string) {
      if (level in levelColors) {
        const color: string = levelColors[level];

        return { color };
      }

      return { color: '#ffffff' };
    },
    async C_executeCommand() {
      const __this = this;

      // Transpile input to lowercase and remove unecessary more than 1 whitespace
      const input: string = __this.C_input.toLowerCase().trim();

      if (input.length > 0) {
        // Extract the arguments from input
        const [commandName, ...args]: any[] = input.split(/ +/);

        // Execute command
        const command = await EXECUTE_CONSOLE_CVAR(commandName, ...args);
        if (!command)
          pushConsoleMessage('error', 'Unknown command');
        else {
          // Push command to history
          // pushCommandToHistory(`${commandName}${args.length > 0 ? ' ' + args.join(' ') : ''}`);
        }

        // Clear input
        __this.C_input = '';
      }
    },
    // todo
    // C_setInputHistory(event: KeyboardEvent) {      
    // }
  },
  computed: {
    ...mapGetters({
      showing: 'console/showing',
      messages: 'console/messages',
      cmdHistory: 'console/history'
    })
  }
});
</script>

<template>
  <div class='console' :style='[C_style()]'>
    <p ref='C_content'>
      <span v-for='(m, index) in messages' :key='index'>
        <span :style='[C_parseLevelColor(m.level)]' v-text='`[${m.level.toUpperCase()}] `'></span>
        <span v-text='m.message'></span>
        <br />
      </span>
    </p>

    <input ref='C_input' type='text' spellcheck='false' v-model='C_input' @keydown='__fixNativeInput($event)' v-on:keyup.enter='C_executeCommand' maxlength='500' />
    <div class='mark'>></div>
  </div>
</template>