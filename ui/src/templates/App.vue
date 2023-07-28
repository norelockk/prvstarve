<template>
  <div id="new_ui">
    <!-- <Annoucement /> -->
    
    <!-- Modals -->
    <div>
      <transition-group name="m-active" tag="div">
        <Modal
          v-for="(modal, i) in modals"
          :key="i"
          :defs="modal.defs"
          :title="modal.title"
          :identifier="modal.identifier"
          :description="modal.description"
          :serverId="modal.serverId"
        />
      </transition-group>
    </div>

    <!-- Messages -->
    <div>
      <transition-group name="m-active" tag="div">
        <Message
          v-for="(message, i) in messages"
          :key="i"
          :title="message.title"
          :actions="message.actions"
          :loading="message.loading"
          :progress="message.progress"
          :description="message.description"
        />
      </transition-group>
    </div>
    
    <!-- UI -->
    <div class="ui" v-if="showing">
      <Navigation />
      <Content />
    </div>

    <!-- Other stuff -->
    <Console />
    <Netgraph />
    <Watermark v-if="!showing" />
  </div>
</template>

<style scoped>
#new_ui {
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: inline-block;
  z-index: 9999999;
  overflow: hidden;
  color: #eaeaea;
  user-select: none;
}

.m-active-enter-active, .m-active-leave-active {
  transition: opacity .5s;
}
.m-active-enter, .m-active-leave-to {
  opacity: 0;
}

@keyframes show {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.ui {
  background: rgba(39, 39, 39, 0.95);
  backdrop-filter: blur(50px);
  height: 100vh;
  animation: show .8s ease 1;
}
</style>

<script lang='ts'>
import Vue from 'vue';
import { mapGetters } from 'vuex';

// Components
import Modal from './components/Modal.vue';
import Content from './components/Content.vue';
import Message from './components/Message.vue';
import Console from './components/Console.vue';
import Netgraph from './components/Netgraph.vue';
import Watermark from './components/Watermark.vue';
import Navigation from './components/Navigation.vue';
import Annoucement from './components/Announcement.vue';

export default Vue.extend({
  computed: {
    ...mapGetters({
      modals: 'modals/array',
      showing: 'ui/showing',
      messages: 'messages/array',
    })
  },
  components: {
    Modal,
    Content,
    Message,
    Console,
    Netgraph,
    Watermark,
    Navigation,
    Annoucement
  },
});
</script>