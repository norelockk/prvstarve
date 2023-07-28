<style scoped>
.nav {
  display: flex;
  align-items: center;
  padding: 60px;
}

.nav .logo {
  height: 45px;
  width: 45px;
  margin-right: 60px;
  content: "";
  background: url(../../assets/img/logo.png) no-repeat center/cover;
}

@keyframes logohue {
  from {
    filter: hue-rotate(0deg);
  }

  to {
    filter: hue-rotate(360deg);
  }
}

.nav .logo.hue {
  animation: logohue 2s linear 1;
}

.nav .links {
  flex-grow: 1;
}

.nav .links a,
.nav .actions a {
  font-size: 36px;
  color: #d4d4d4;
  opacity: .6;
  margin-right: 35px;
  text-decoration: none;
  line-height: 0;
  transition: all .3s;
  display: inline-block;
}

.nav .links a:hover,
.nav .actions a:hover {
  opacity: 1;
}

.nav .links a.active,
.nav .actions a.active {
  color: #ececec;
  opacity: 1;
}

.nav .links div.sep {
  display: inline-block;
  height: 36px;
  margin-right: 35px;
  width: 2px;
  background: rgba(255, 255, 255, .2);
}

.nav .actions a {
  margin-left: 35px;
  margin-right: 0;
}

@media screen and (min-width: 1921px) {
  .nav {
    width: 1920px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 1366px),
(max-height: 768px) {
  .nav {
    padding-bottom: 30px;
  }

  .nav .logo {
    width: 40px;
    height: 40px;
    margin-right: 40px;
  }

  .nav .links a,
  .nav .actions a {
    font-size: 30px;
  }

  .nav .links div.sep {
    height: 30px;
  }

  .nav .info p {
    font-size: 11px;
  }
}

@media screen and (max-width: 800px),
(max-height: 600px) {
  .nav {
    padding: 30px;
  }

  .nav .logo {
    margin-right: 35px;
  }

  .nav .links a,
  .nav .actions a {
    font-size: 25px;
  }

  .nav .links a,
  .nav .actions a,
  .nav .links div.sep {
    margin-right: 20px;
  }

  .nav .links div.sep {
    height: 22px;
  }

  .nav .actions a {
    margin-right: 0;
    margin-left: 20px;
  }
}
</style>

<script>
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    EASTER: {
      SHOW: false,
      CLICKS: 0,
      TIMEOUT: false,
      MAX_CLICKS: 4,
    },
    LINKS: [],
  }),
  created() {
    return this.N_init();
  },
  methods: {
    N_easterAfterTimeout() {
      if (this.EASTER.TIMEOUT && this.EASTER.SHOW) {
        clearTimeout(this.EASTER.TIMEOUT);
        this.EASTER.TIMEOUT = false;
        
        this.EASTER.CLICKS = 0;
        this.EASTER.SHOW = false;
      }
    },
    N_easterClick() {
      if (!this.EASTER.SHOW) {
        if (this.EASTER.CLICKS > this.EASTER.MAX_CLICKS) {
          this.EASTER.SHOW = true;
          this.EASTER.TIMEOUT = setTimeout(this.N_easterAfterTimeout, 2 * 1000);
        } else this.EASTER.CLICKS++;
      }
    },
    N_init() {
      // sorting time lmao
      this.LINKS = this.$router.options.routes.filter(route => route && 'link' in route.meta);
    }
  },
});
</script>

<template>
  <section class="nav">
    <div
      class="logo"
      :class="!!EASTER.SHOW ? 'hue' : ''"
      @click="N_easterClick"
    ></div>

    <div class="links">
      <router-link
        v-for="(link, index) in LINKS"
        v-tippy="{ placement: 'bottom' }"

        :to="link.path"
        :key="index"
        :content="link.meta.link.tooltip"
      >
        <span :class="`ic-${link.meta.link.icon}`"></span>
      </router-link>
    </div>
  </section>
</template>