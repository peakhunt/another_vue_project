<template>
  <v-app>
		<v-navigation-drawer 
     v-model="drawer"
     :mini-variant.sync="mini"
     permanent
     app
     dark
    >
			<v-list-item>
        <v-list-item-avatar>
          <v-img :src="require('@/assets/vmd.svg')"/>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <strong class="mr-1 font-weight-black">Macron</strong>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{appName}} &nbsp; {{appVersion}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider class="mx-3 mb-2" />

			<v-list
       expand
       nav
      >
        <v-list-item
         v-for="item in navItems"
         :key="item.title"
         :to="item.to"
         active-class="primary white--text"
         class="py-1"
        >
          <v-list-item-icon class="my-2 align-self-center">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider class="mx-3 mb-2" />


      <v-list expand>
        <v-list-item  @click.stop="openConfig" :disabled="isSimRunning">
          <v-list-item-icon class="my-2 align-self-center">
            <v-icon>mdi-file-upload</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>설정 불러오기</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item  @click.stop="saveConfig" :disabled="!isSettingsOK || isSimRunning">
          <v-list-item-icon class="my-2 align-self-center">
            <v-icon>mdi-file-download</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>설정 저장</v-list-item-title>
            <v-list-item-subtitle v-if="!isSettingsOK" class="red--text">설정 에러!!!</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <div class="pt-12" />

		</v-navigation-drawer>

		<v-app-bar
     app
     fixed
     elevate-on-scroll
     class="v-bar--underline"
     color="white"
     :clipped-left="$vuetify.rtl"
     :clipped-right="!$vuetify.rtl"
     outlined
     rounded
     elevation-13
    >
      <v-toolbar-title
       class="font-weight-light text-h5"
       v-text="currentRouteName"
      />

      <v-spacer/>
      <!-- 
      <v-btn icon>
        <v-icon x-large>
          file_open
        </v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon x-large>
          save
        </v-icon>
      </v-btn>
    -->
		</v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  name: 'App',
	computed: {
    ...mapGetters([
      'appName',
      'appVersion',
      'isSettingsOK',
      'isSimRunning',
      'settingsFileName',
      'settings',
    ]),
		currentRouteName() {
      //return this.$route.name;
      return 'Macron Wave Simulator'
    }
	},
  data: () => ({
    //
		drawer: true,
		mini: false,
		navItems: [
      {
        icon: 'mdi-view-dashboard',
        title: 'Dashboard',
        to: '/',
      },
      {
        icon: 'mdi-cog',
        title: 'Settings',
        to: '/Settings',
      },
    ],
  }),
  methods: {
    openConfig() {
      ipcRenderer.send('openSettings');
    },
    saveConfig() {
      ipcRenderer.send('saveSettings', {
        name: this.settingsFileName,
        settings: this.settings,
      })
    },
  },
  mounted() {
    ipcRenderer.on('openSettingsComplete', (e, { success, name, settings }) => {
      //console.log(`open complete ${success} ${name} ${JSON.stringify(settings)}`)
      if (success) {
        this.$store.commit('setSettings', settings)
        this.$store.commit('setSettingsFileName', name)
      }
    })
    ipcRenderer.on('saveSettingsComplete', (e, { success, name }) => {
      //console.log(`save complete ${success} ${name}`)
      if (success) {
        this.$store.commit('setSettingsFileName', name)
      }
    })
  }
};
</script>