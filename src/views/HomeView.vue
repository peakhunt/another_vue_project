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
                        @click.stop="startSimulation" :disabled="!canRunSimulation">mdi-play-circle-outline</v-icon>
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
                        @click.stop="stopSimulation">mdi-stop-circle-outline</v-icon>
                    </div>
                  </template>
                  <span>시뮬레이션 정지</span>
                </v-tooltip>
              </v-btn>
            </v-list-item-avatar>
          </v-list-item>
          <v-card-text v-if="!isSimRunning && simDataLogLength !== 0">
            <a href="#" class="white--text" @click.prevent="onExportData">
              시뮬레이션 데이타 저장 ({{simDataLogLength}})
            </a>
          </v-card-text>
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
              <v-list-item-subtitle>&nbsp;</v-list-item-subtitle>
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
            변경 주기 : {{settingsRandChangeInterval}} 초
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
      <v-col cols="4" class="d-flex" style="flex-direction:column">
        <v-card color="#385F73" dark rounded class="flex-grow-1">
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
      <v-col cols="4" class="d-flex" style="flex-direction:column">
        <v-card color="#1F7087" dark rounded class="flex-grow-1">
          <v-list-item two-line>
            <v-list-item-content>
              <div class="text-h6">
                 파주기
              </div>
              <v-list-item-title class="text-h4 mb-1">
                {{ currentFrequency }}
                <span class="text-h6">초</span>
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
      <v-col cols="4" class="d-flex" style="flex-direction:column">
        <v-card color="#952175" dark rounded class="flex-grow-1" ref="directionCard">
          <v-carousel v-model="directionCarousel" :height="carouselHeight"
            show-arrows-on-hover
            hide-delimiters>
            <v-carousel-item>
              <v-sheet height="100%" color="transparent">
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
                <v-sheet class="fill-height" color="transparent">
                  <v-sparkline
                    :value="directionHistory"
                    :smooth="4"
                    :gradient="['#f72047', '#ffd200', '#1feaea']"
                    :line-width="2"
                    padding="16"
                    stroke-linecap="round"
                  ></v-sparkline>
                </v-sheet>
              </v-sheet>
            </v-carousel-item>
            <v-carousel-item>
              <v-container fill-height fluid v-resize="onResize">
                <v-row align="center" justify="center">
                  <RadialGauge v-if="directionCarousel === 1" :value="currentDirection" :options="gaugeOptions" ref="gauge"></RadialGauge>
                </v-row>
              </v-container>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="12" v-if="manualMode">
        <v-expand-transition>
          <WaveSimData :readonly="true"/>
        </v-expand-transition>
      </v-col>

      <v-col cols="12" md="12" v-if="!manualMode">
        <v-expand-transition>
          <RandomSimData :readonly="true" />
        </v-expand-transition>
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
import {  ipcRenderer } from 'electron'
import { createObjectCsvWriter } from 'csv-writer'
import RadialGauge from 'vue2-canvas-gauges/src/RadialGauge'

export default {
  name: 'Home',
  components: {
    WaveSimData,
    RandomSimData,
    LoaderDialog,
    RadialGauge,
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
      'simDataLogLength',
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
    directionCarousel: 0,
    carouselHeight: 180,
    gaugeBugCount: 0,
    gaugeOptions: {
      height: 180,
      width: 180,
      title: '파향',
      units: '°',
      minValue: 0,
      maxValue: 360,
      majorTicks: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'],
      minorTicks: 22,
      ticksAngle: 360,
      startAngle: 180,
      strokeTicks: false,
      highlights: false,
      colorPlate: '#33a',
      colorMajorTicks: '#f5f5f5',
      colorMinorTicks: '#ddd',
      colorNumbers: '#ccc',
      colorNeedle: 'rgba(240, 64, 64, 1)',
      colorNeedleEnd: 'rgba(255, 32, 32, .9)',
      colorTitle: '#ffffff',
      colorUnits: '#ffffff',
      valueBox: true,
      valueTextShadow: false,
      needleCircleSize: 5,
      needleCircleOuter: false,
      needleCircleInner: true,
      animationRule: 'linear',
      needleType: 'line',
      needleStart: 75,
      needleEnd: 99,
      needleWidth: 3,
      borders: true,
      borderInnerWidth: 0,
      borderMiddleWidth: 0,
      borderOuterWidth: 8,
      colorBorderOuter: '#ccc',
      colorNeedleShadowDown: '#222',
      borderShadowWidth: 0,
      animationTarget: 'plate',
      useMinPath: true,
      fontTitleSize: 32,
      fontUnitsSize: 32,
      fontValueSize: 32,
      animation: true,
      animationOnInit: false,
      animationDuration: 250,
    },
  }),
  methods: {
    startSimulation() {
      let self = this

      self.loaderMsg = '시뮬레이션을 시작하는 중'
      self.loaderShow = true

      self.gaugeBugCount = 0

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
    async onExportData() {
      let filePath = await ipcRenderer.invoke('dialog:exportData')

      if (filePath === undefined) {
        return
      }

      let self = this

      self.loaderMsg = '시뮬레이션 데이타를 저장하는 중'
      self.loaderShow = true

      let csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'time', title: '시간' },
          { id: 'height', title: '파고' },
          { id: 'frequency', title: '파주기' },
          { id: 'direction', title: '파향' },
        ],
      })

      let keys = Object.keys(localStorage);
      keys.sort();
      let values = [];
      let i;

      for(i = 0; i < keys.length; i++) {
        let item = JSON.parse(localStorage.getItem(keys[i]));
        values.push({
          time: keys[i],
          height: item.height,
          frequency: item.frequency,
          direction: item.direction,
        });
      }

      csvWriter.writeRecords(values)
      .then(() => {
        setTimeout(() => {
          self.loaderShow = false

          self.snackbarMsg = '시뮬레이션 데아타 저장 완료'
          self.snackbarTimeout =2000 
          self.snackbar = true
        }, 1000)
      })
    },
    onResize() {
      // console.log(`onResize(), ${(new Date()).toLocaleString()}`)
      let self = this

      let newOpt = JSON.parse(JSON.stringify(self.gaugeOptions))
      newOpt.height = self.$refs.directionCard.$el.clientHeight
      newOpt.width = newOpt.height
      self.carouselHeight = newOpt.height 

      // this will trigger gauge destroy and new creation
      self.gaugeOptions = newOpt

      self.gaugeBugCount = 0
    },
  },
  watch: {
    directionCarousel(newVal, oldVal) {
      let self = this

      if (oldVal === 0 && newVal === 1) {
        self.onResize();
      }
    },
    /*
    currentDirection() {
      //
      // XXX
      // canvas-gauge bug workaround!!!
      //
      let self = this

      self.gaugeBugCount += 1
      if (self.gaugeBugCount > 200) {
        self.$refs.gauge.chart.canvas.redraw()
        // console.log(`canvas-gauge bug workaround ${self.gaugeOptions.animationTarget}`)
        self.gaugeBugCount = 0
      }
    }
    */
  }
}
</script>