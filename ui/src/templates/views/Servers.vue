<style scoped>
.servers .info {
  float: right !important;
}

.servers .info p {
  font-weight: 500;
  text-transform: uppercase;
  margin: 0;
  line-height: 20px;
  font-size: 13px;
  text-align: right;
  color: #d4d4d4;
  opacity: .7;
}

.servers .filters {
  display: inline-block;
  border-right: 2px solid rgba(255, 255, 255, .1);
  padding-right: 50px;
  padding-bottom: 12px;
  margin-right: 50px;
}

.servers .filters div.search {
  margin-bottom: 30px;
}

.servers .filters div.search input {
  border: 0;
  background: rgba(255, 255, 255, .05);
  border-bottom: 2px solid rgba(255, 255, 255, .2);
  padding: 15px;
  color: #eee;
  width: 250px;
  transition: all .2s;
}

.servers .filters div.search input::-webkit-input-placeholder {
  transition: all .3s;
}

.servers .filters div.search input:hover {
  border-bottom: 2px solid rgba(255, 255, 255, .8);
}

.servers .filters div.search input:focus::-webkit-input-placeholder {
  opacity: 0;
}

.servers .filters div.search input::selection {
  background: #fff;
  color: #000;
}

.servers .filters div.option {
  margin-bottom: 20px;
}

.servers .filters div.option input[type="checkbox"] {
  appearance: none;
  position: relative;
}

.servers .filters div.option input[type="checkbox"]::before {
  content: "";
  display: inline-block;
  background: rgba(255, 255, 255, .1);
  border-radius: 100px;
  width: 32px;
  height: 32px;
  position: relative;
  top: 10px;
  margin-right: 15px;
  box-sizing: border-box;
  transition: all .2s;
}

.servers .filters div.option input[type="checkbox"]:hover::before {
  background: rgba(255, 255, 255, .2)
}

.servers .filters div.option input[type="checkbox"]:checked::before {
  background: #ccc;
}

.servers .filters div.option input[type="checkbox"]:checked::after {
  font-family: 'Icons';
  content: "S";
  position: absolute;
  top: 16px;
  right: 22px;
  color: #119100;
  font-size: 18px;
}

.servers .filters div.option label {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 10px 0px;
}

.servers .filters a.update {
  display: block;
  font-size: 20px;
  color: #d4d4d4;
  opacity: .6;
  text-decoration: none;
  line-height: 0;
  transition: all .3s;
  text-transform: uppercase;
  font-weight: 500;
  margin-top: 50px;
}

.servers .filters a.update i {
  margin-right: 10px;
  font-size: 24px;
  position: relative;
  top: 3px;
}

.servers .filters a.update i::before {
  display: inline-block;
}

.servers .filters a.update i.spin::before {
  animation: upd 1s infinite linear;
}

@keyframes upd {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.servers .filters a.update:hover {
  opacity: 1;
}

.serverlist {
  width: 100%;
  position: relative;
}

.serverlist .header {
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  width: 100%;
}

.serverlist .header div.section {
  display: inline-flex;
  background: rgba(255, 255, 255, .05);
  padding: 16px;
  color: rgba(255, 255, 255, .5);
  text-transform: uppercase;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(255, 255, 255, .2);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  transition: all .3s;
  position: relative;
}

.serverlist .header div.section:hover,
.serverlist .header div.section.active {
  border-bottom: 2px solid rgba(255, 255, 255, .4);
  color: rgba(255, 255, 255, .8);
  background: rgba(255, 255, 255, .1);
}

.serverlist .header div.section.servername,
.serverlist table td.servername {
  width: 50%;
  text-align: left;
}

.serverlist .header div.section.gamemode,
.serverlist .header div.section.website,
.serverlist table td.gamemode,
.serverlist table td.website {
  width: 15%;
}

.serverlist .header div.section.ping,
.serverlist .header div.section.players,
.serverlist table td.ping,
.serverlist table td.players {
  width: 10%;
}

.serverlist div.wrapper {
  height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.serverlist div.wrapper::-webkit-scrollbar-button {
  display: none;
}

.serverlist div.wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, .4);
}

.serverlist div.wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #CCC;
}

.serverlist div.wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, .08);
}

.serverlist div.wrapper::-webkit-scrollbar {
  width: 3px;
  position: absolute;
  transition: all .3s;
}

.serverlist table {
  width: calc(100% + 3px);
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.serverlist table tr {
  background: rgba(255, 255, 255, .08);
  transition: all .3s;
}

.serverlist table tr:hover {
  background: rgba(255, 255, 255, .15);
}

.serverlist table tr:active {
  background: rgba(255, 255, 255, .2);
  transition: all .1s;
}

.serverlist table td {
  text-align: center;
  padding: 20px;
  font-size: 15px;
}

.serverlist table td div.icons {
  display: inline-block;
}

.serverlist table td div.icons span,
.serverlist table td div.icons a {
  font-size: 18px;
  color: #d4d4d4;
  opacity: .6;
  margin-right: 15px;
  text-decoration: none;
  line-height: 0;
  transition: all .3s;
}

.serverlist table td div.icons a:hover {
  opacity: 1;
}

.serverlist table td div.icons a.fav {
  color: #8ec15c;
  opacity: 1;
}

.serverlist table tr.unique td.servername {
  color: #7a9c59;
  opacity: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.serverlist table tr.unique {
  background: rgba(255, 255, 255, .12);
  transition: all .3s;
}

.serverlist table tr.unique:hover {
  background: rgba(255, 255, 255, .15);
}

.serverlist table tr.unique:active {
  background: rgba(255, 255, 255, .2);
  transition: all .1s;
}

.serverlist table td.players span {
  font-size: 12px;
  opacity: .5;
}

.serverlist table tr.unique td.servername {
  font-weight: 500;
}

@media screen and (min-width: 3839px),
(min-height: 2159px) {
  .serverlist div.wrapper {
    height: 30vh;
  }
}

@media screen and (max-width: 1600px),
(max-height: 900px) {
  .serverlist div.wrapper {
    height: 55vh;
  }
}

@media screen and (max-width: 1366px),
(max-height: 768px) {
  .servers .filters div.search input {
    padding: 10px 15px;
    width: 170px;
    font-size: 15px;
  }

  .servers .filters div.option {
    margin-bottom: 15px;
  }

  .servers .filters div.option input[type="checkbox"]::before {
    width: 28px;
    height: 28px;
  }

  .servers .filters div.option input[type="checkbox"]:checked::after {
    right: 16px;
  }

  .servers .filters div.option input[type="checkbox"]:checked::after {
    top: 15px;
    right: 21px;
    font-size: 16px;
  }

  .servers .filters div.option label {
    font-size: 12px;
  }

  .servers .filters a.update {
    font-size: 16px;
  }

  .servers .filters a.update i {
    font-size: 20px;
  }

  .serverlist .header div.section {
    font-size: 12px;
    padding: 11px 15px;
  }

  .serverlist div.wrapper {
    height: 50vh;
  }

  .serverlist table td {
    padding: 17px;
    font-size: 13px;
  }

  .serverlist table td div.icons span,
  .serverlist table td div.icons a {
    font-size: 16px;
    margin-right: 10px;
  }

  .serverlist table td.servername {
    font-size: 15px;
  }

  .serverlist .header div.section.ping i {
    position: relative;
    top: 1px;
  }

  .serverlist table td.players span {
    font-size: 10px;
  }
}

@media screen and (max-width: 1280px),
(max-height: 1024px) {
  .serverlist div.wrapper {
    height: 65vh;
  }
}

@media screen and (max-width: 1280px),
(max-height: 800px) {
  .serverlist div.wrapper {
    height: 58vh;
  }
}

@media screen and (max-width: 1280px),
(max-height: 960px) {
  .serverlist div.wrapper {
    height: 55vh;
  }
}

@media screen and (max-width: 1280px),
(max-height: 720px) {
  .serverlist div.wrapper {
    height: 50vh;
  }
}

@media screen and (max-width: 1152px),
(max-height: 727px) {
  .servers .filters {
    position: absolute;
    bottom: 50px;
    padding: 0;
    margin: 0;
    border: 0;
  }

  .servers .filters div.search,
  .servers .filters div.option,
  .servers .filters a.update {
    display: inline-block;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .servers .filters div.search {
    margin-right: 15px;
  }

  .servers .filters div.option {
    margin-right: 20px;
  }

  .servers .filters div.option input[type="checkbox"]::before {
    margin-right: 10px;
  }

  .servers .filters div.option input[type="checkbox"]:checked::after {
    right: 16px;
  }

  .serverlist div.wrapper {
    height: 49vh;
  }
}

@media screen and (max-width: 800px),
(max-height: 600px) {
  .serverlist .header div.section {
    padding: 10px;
  }

  .serverlist table td {
    padding: 12px;
  }

  .serverlist table td.servername {
    font-size: 13px;
  }

  .servers .filters {
    bottom: 30px;
  }
}
</style>

<template>
  <div class="servers">
    <h1 v-text="$route.name"></h1>

    <div class="info">
      <p>Players online: {{ COUNT.PLAYERS }}</p>
      <p>Available servers: {{ COUNT.SERVERS }}</p>
    </div>

    <div class="content">
      <div class="filters">
        <div class="search">
          <input v-model.trim="FILTERS.SEARCH_INPUT" autocomplete="off" name="search" placeholder="Search"
            spellcheck="false" type="text" />
        </div>
        <div class="option">
          <input v-model="FILTERS.HIDE_FULL" name="full" type="checkbox" />
          <label for="full" v-text="'Hide full servers'"></label>
        </div>
        <div class="option">
          <input v-model="FILTERS.HIDE_EMPTY" name="empty" type="checkbox" />
          <label for="empty" v-text="'Hide empty servers'"></label>
        </div>
        <div class="option">
          <input v-model="FILTERS.HIDE_LOCKED" name="locked" type="checkbox" />
          <label for="locked" v-text="'Hide locked servers'"></label>
        </div>
      </div>
      
      <div class="serverlist">
        <div class="header">
          <div @click="S_sort('n', 0)" class="section servername" v-text="'Server name'"></div>
          <div @click="S_sort('cp', 1)" class="section players" v-text="'Players'"></div>
          <div class="section ping" v-text="'Ping'"></div>
          <div class="section gamemode" v-text="'Gamemode'"></div>
          <div class="section website" v-text="'Website'"></div>
        </div>

        <div class="wrapper">
          <table>
            <tbody>
              <tr v-for="(server, index) in SERVERS_FILTERED" @click="S_selectServer(server)" :key="index">
                <td class="servername" v-text="server.n"></td>
                <td class="players">
                  {{ server.cp }}
                  <span> / {{ server.mp }}</span>
                </td>
                <td class="ping" v-text="server.l + ' ms'"></td>
                <td class="gamemode" v-text="server.m"></td>
                <td class="website" v-text="server.w"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import sortBy from 'sort-by';

import { Server } from '@/interfaces';

export default Vue.extend({
  data: () => ({
    COUNT: {
      SERVERS: 0,
      PLAYERS: 0
    },
    ORDERS: [] as any,
    FILTERS: {
      HIDE_FULL: false,
      HIDE_EMPTY: false,
      HIDE_LOCKED: false,
      SEARCH_INPUT: ''
    },
    SERVERS: [
      // {
      //   n: 'Test server',
      //   cp: 200,
      //   mp: 200,
      //   l: 25,
      //   m: 'Forest (Legacy)',
      //   w: 'restarve.pro',
      //   u: 'xxxxx-xxxxxxxx-xxxx-xxxxx',
      //   lc: false,
      // },
      // {
      //   n: 'Test x server',
      //   cp: 4500,
      //   mp: 200,
      //   l: 25,
      //   m: 'Forest (Legacy)',
      //   w: 'restarve.pro',
      //   u: 'xxxxx-xxxxxxxx-xxxx-xxxxx',
      //   lc: false,
      // },
    ] as Server[],
  }),
  computed: {
    SERVERS_FILTERED() {
      let TOTAL_PLAYERS: number = 0;
      let TOTAL_SERVERS: number = 0;

      const filtered = this.SERVERS.filter(server => {
        let s;

        if (this.FILTERS.HIDE_FULL && server.cp >= server.mp && (this.FILTERS.HIDE_EMPTY && server.cp <= 0)) {
        } else if (this.FILTERS.HIDE_FULL && server.cp >= server.mp) {
        } else if (this.FILTERS.HIDE_EMPTY && server.cp <= 0) {
        } else if (this.FILTERS.HIDE_LOCKED && !!server.lc) {
        } else s = server.n.toLowerCase().match(this.FILTERS.SEARCH_INPUT.toLowerCase());

        return s;
      });

      for (let index = 0; index < filtered.length; index++) {
        const server = filtered[index];

        if (server) {
          TOTAL_PLAYERS += server.cp;
          TOTAL_SERVERS += 1;
        }
      }

      this.COUNT.PLAYERS = TOTAL_PLAYERS;
      this.COUNT.SERVERS = TOTAL_SERVERS;

      return filtered;
    },
  },
  methods: {
    S_sort(property: string, index: number) {
      if (this.ORDERS[index] === '-') {
        this.SERVERS = this.SERVERS.sort(sortBy(property));
        this.ORDERS[index] = "+";
      } else {
        this.SERVERS = this.SERVERS.sort(sortBy(`-${property}`));
        this.ORDERS[index] = "-";
      }
    },
    S_selectServer(data: Server) {
      return this.$store.dispatch('modals/create', {
        defs: [
          {
            title: 'Players online',
            text: `${data.cp}/${data.mp}`
          },
          {
            title: 'Gamemode',
            text: data.m
          },
          {
            title: 'Website',
            text: data.w
          }
        ],
        title: data.n,
        serverId: data.u,
        identifier: 'SERVER_SELECTION',
        description: 'You are joining to..'
      });
    }
  }
})
</script>