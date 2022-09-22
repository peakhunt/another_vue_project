<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1" color="#952175">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline">
                 운영 상태
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ isSimRunning ? '실행중' : '정지' }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-h6">{{runtimeString}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="80">
              <v-btn icon x-large>
                <v-tooltip bottom v-if="!isSimRunning">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on">
                      <v-icon
                        v-bind="attrs"
                        x-large
                        v-if="!isSimRunning"
                        @click.stop="startSimulation" :disabled="!canRunSimulation">play_circle</v-icon>
                      </div>
                  </template>
                  <span> {{ canRunSimulation ? '시뮬레이션 시작' : '설정에 문제가 있어 시뮬레이션을 시작할 수 없음' }}</span>
                </v-tooltip>

                <v-tooltip bottom v-if="isSimRunning">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on">
                      <v-icon
                        v-bind="attrs"
                        x-large
                        v-if="isSimRunning"
                        @click.stop="stopSimulation">stop_circle</v-icon>
                    </div>
                  </template>
                  <span>시뮬레이션 정지</span>
                </v-tooltip>
              </v-btn>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="3" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1" color="#385F73">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline">
                 운영 모드
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ manualMode ? '매뉴얼' : '랜덤' }}
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="80">
              <v-tooltip bottom v-if="!isSimRunning">
                <template v-slot:activator="{ on, attrs }">
                  <div v-on="on" v-bind="attrs">
                    <v-switch
                      v-model="manualMode"
                      :readonly="isSimRunning"
                    ></v-switch>
                  </div>
                </template>
                <span>{{ manualMode ? '랜덤 모드로 전환' : '매뉴얼 모드로 전환' }}</span>
              </v-tooltip>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-text v-if="manualMode">
            {{ simDataNdx }}: {{currentHeight}}/{{currentFrequency}}/{{currentDirection}}
          </v-card-text>
          <v-card-text v-if="!manualMode">
            변경 주기 : {{settingsRandChangeInterval}} 분
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="3" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1" :color="tcpServerCardColor">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline">
                 TCP 서비
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ isTcpServerActivated ? ( isSimRunning ? '실행중' : '활성') : '비활성' }}
              </v-list-item-title>
              <v-list-item-subtitle>포트: {{ settingsTCPServerPort }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-text v-if="isTcpServerActivated">
            Clients: {{ numTCPClients}}, Tx Count: {{ tcpTxCount }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="3" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1" :color="udpServerCardColor">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline">
                 UDP 서버
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ isUdpServerActivated ? ( isSimRunning ? '실행중' : '활성') : '비활성' }}
              </v-list-item-title>
              <v-list-item-subtitle>IP/포트: {{settingsUdpServerIP}}:{{settingsUdpServerPort}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            Tx Count: {{udpTxCount}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-card color="#385F73" dark rounded>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="text-h6">
                 파고
              </div>
              <v-list-item-title class="text-h4 mb-1">
                {{ currentHeight }}
                <span class="text-h6">미터</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-sheet color="transparent">
            <v-sparkline
              :value="heightHistory"
              :smooth="4"
              :gradient="['#f72047', '#ffd200', '#1feaea']"
              :line-width="2"
              padding="16"
              stroke-linecap="round"
            ></v-sparkline>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card color="#1F7087" dark rounded>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="text-h6">
                 파주기
              </div>
              <v-list-item-title class="text-h4 mb-1">
                {{ currentFrequency }}
                /<span class="text-h6">s</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-sheet color="transparent">
            <v-sparkline
              :value="frequencyHistory"
              :smooth="4"
              :gradient="['#f72047', '#ffd200', '#1feaea']"
              :line-width="2"
              padding="16"
              stroke-linecap="round"
            ></v-sparkline>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card color="#952175" dark rounded>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="text-h6">
                 파향
              </div>
              <v-list-item-title class="text-h4 mb-1">
                {{ currentDirection }}°
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-sheet color="transparent">
            <v-sparkline
              :value="directionHistory"
              :smooth="4"
              :gradient="['#f72047', '#ffd200', '#1feaea']"
              :line-width="2"
              padding="16"
              stroke-linecap="round"
            ></v-sparkline>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="12" v-if="manualMode">
        <WaveSimData :readonly="true"/>
      </v-col>

      <v-col cols="12" md="12" v-if="!manualMode">
        <RandomSimData :readonly="true" />
      </v-col>
    </v-row>
    <LoaderDialog :value="loaderShow" :msg="loaderMsg" />
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout">
      {{ snackbarMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn
         color="pink"
         text
         v-bind="attrs"
         @click="snackbar = false"
        >
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import WaveSimData from '@/components/WaveSimData.vue'
import RandomSimData from '@/components/RandomSimData.vue'
import LoaderDialog from '@/components/LoaderDialog.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    WaveSimData,
    RandomSimData,
    LoaderDialog,
  },
  computed: {
    ...mapGetters([
      'isTcpServerActivated',
      'settingsTCPServerPort',
      'numTCPClients',
      'tcpTxCount',
      'udpTxCount',
      'isUdpServerActivated',
      'settingsUdpServerIP',
      'settingsUdpServerPort',
      'isUdpSettingValid',
      'isTcpSettingValid',
      'isManualMode',
      'isSimRunning',
      'isSettingsOK',
      'simRunningTime',
      'currentHeight',
      'currentFrequency',
      'currentDirection',
      'heightHistory',
      'frequencyHistory',
      'directionHistory',
      'simDataNdx',
      'numSimDataList',
      'settingsRandChangeInterval',
    ]),
    tcpServerCardColor() {
      if (this.isTcpServerActivated == false) {
        return 'black'
      }

      if (this.isTcpSettingValid == false) {
        return 'red'
      }

      return '#1F7087'
    },
    udpServerCardColor() {
      if (this.isUdpServerActivated == false) {
        return 'black'
      }

      if (this.isUdpSettingValid == false) {
        return 'red'
      }

      return '#385F73'
    },
    manualMode: {
      get () {
        return this.isManualMode;
      },
      set (newValue) {
        this.$store.commit('setManualMode', newValue);
      },
    },
    runtimeString() {
      let v = this.simRunningTime

      let hours   = Math.floor(v / 3600)
      let minutes = Math.floor((v - (hours * 3600)) / 60)
      var seconds = v - (hours * 3600) - (minutes * 60)

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
    },
    canRunSimulation() {
      if (this.isSettingsOK === false) {
        return false
      }

      if (this.manualMode && this.numSimDataList === 0) {
        return false;
      }

      return true;
    },
  },
  data: () => ({
    loaderShow: false,
    loaderMsg: '',
    snackbar: false,
    snackbarMsg: '',
    snackbarTimeout: -1,
  }),
  methods: {
    startSimulation() {
      let self = this

      self.loaderMsg = '시뮬레이션을 시작하는 중'
      self.loaderShow = true

      self.$store.dispatch('startSimulation', (err) => {
        setTimeout(() => {
          if (err) {
            self.snackbarMsg = 'TCP 서버 시작 실패. 포트 넘버를 변경해 보기 바람'
            self.snackbarTimeout = -1
            self.snackbar = true
          } else {
            self.loaderShow = false

            self.snackbarMsg = '시뮬레이션 시작됨'
            self.snackbarTimeout =2000 
            self.snackbar = true
          }
        }, 1500)
      })
    },
    stopSimulation() {
      let self = this

      self.loaderMsg = '시뮬레이션을 중지하는 중'
      self.loaderShow = true

      self.$store.dispatch('stopSimulation', () => {
        setTimeout(() => {
          self.loaderShow = false

          self.snackbarMsg = '시뮬레이션 중지됨'
          self.snackbarTimeout =2000 
          self.snackbar = true
        }, 1500)
      })
    },
  }
}
</script>
