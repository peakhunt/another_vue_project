<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" class="d-flex" style="flex-direction:column" v-if="settingsFileName !== ''">
        <v-card dark color="#385F73" class="flex-grow-1">
          <v-card-title class="text-h5">
            설정 파일
          </v-card-title>
          <v-card-subtitle>설정 파일 이름</v-card-subtitle>
          <v-card-text>
            <v-text-field
                label="설장 파일 이름"
                v-model="settingsFileName"
                required
                readonly
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="d-flex" style="flex-direction:column">
        <v-card dark color="#385F73" class="flex-grow-1">
          <v-card-title class="text-h5">
            데이타 전송 인터벌 설정
          </v-card-title>
          <v-card-subtitle>데이타 전송 인터벌 설정</v-card-subtitle>
          <v-card-text>
            <v-form v-model="dataIntervalValid" ref="formDataInterval" :readonly="isSimRunning">
              <v-row>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                      label="데이타 전송 인터벌"
                      :hint="`데이타 전송 인터벌. ${default_values.dataIntervalMin} 이상 ${default_values.dataIntervalMax} 이하. 1000 ms = 1 초`"
                      v-model.number="dataInterval"
                      type="number"
                      :rules="[rules.dataIntervalRule]"
                      suffix="ms"
                      required
                      @keypress="IntegerOnly"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" class="d-flex" style="flex-direction:column">
        <v-card dark color="#1F7087" class="flex-grow-1">
          <v-card-title class="text-h5">
            TCP 서버 설정
          </v-card-title>
          <v-card-subtitle>TCP 서버 활성/비활성 및 포트 설정</v-card-subtitle>
          <v-card-text>
            <v-form v-model="tcpSettingValid" ref="formTcpServer" :readonly="isSimRunning">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-switch
                    v-model="tcpServerEnabled"
                    :label="`TCP 서버: ${tcpServerEnabled ? '활성' : '비활성'}`"
                  >
                  </v-switch>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                      label="TCP 서버 포트"
                      :hint="`TCP 서버 포트. ${default_values.tcpServerPortMin} 보다 크고 ${default_values.tcpServerPortMax} 이하 `"
                      v-model.number="tcpServerPort"
                      type="number"
                      :rules="[rules.tcpServerPortRule]"
                      required
                      @keypress="IntegerOnly"
                      :disabled="!tcpServerEnabled"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" class="d-flex" style="flex-direction:column">
        <v-card dark color="#952175" class="flex-grow-1">
          <v-card-title class="text-h5">
            UDP 서버 설정
          </v-card-title>
          <v-card-subtitle>UDP 서버 활성/비활성 및 포트 설정</v-card-subtitle>
          <v-card-text>
            <v-form v-model="udpSettingValid" ref="formUdpServer" :readonly="isSimRunning">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-switch
                    v-model="udpServerEnabled"
                    :label="`UDP 서버: ${udpServerEnabled ? '활성' : '비활성'}`"
                  >
                  </v-switch>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                      label="UDP 포트"
                      :hint="`UDP 포트. ${default_values.udpPortMin} 보다 크고 ${default_values.udpPortMax} 이하`"
                      v-model.number="udpPortNumber"
                      type="number"
                      :rules="[rules.udpPortNumber]"
                      required
                      @keypress="IntegerOnly"
                      :disabled="!udpServerEnabled"
                  />
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                      label="UDP 전송 IP 주소"
                      hint="UDP 전송 IP 주소"
                      v-model="udpDestinationIP"
                      :rules="[rules.udpDestinationIP]"
                      required
                      :disabled="!udpServerEnabled"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="d-flex" style="flex-direction:column">
        <WaveSimData :readonly="isSimRunning"/>
      </v-col>

      <v-col cols="12" class="d-flex" style="flex-direction:column">
        <RandomSimData :readonly="isSimRunning" />
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import WaveSimData from '@/components/WaveSimData.vue'
import RandomSimData from '@/components/RandomSimData.vue'
import { mapGetters } from 'vuex'
import default_values from '@/utils/default_values'

export default {
  name: 'Settings',
  components: {
    RandomSimData,
    WaveSimData
  },
  computed: {
    ...mapGetters([
      'isDataIntervalValid',
      'isTcpSettingValid',
      'isTcpServerActivated',
      'isUdpSettingValid',
      'isUdpServerActivated',
      'settingsDataInterval',
      'settingsTCPServerPort',
      'settingsUdpServerPort',
      'settingsUdpServerIP',
      'isSimRunning',
      'settingsFileName',
    ]),
    dataInterval: {
      get () {
        return this.settingsDataInterval
      },
      set (newValue) {
        this.$store.commit('setDataInterval', newValue)
      },
    },
    dataIntervalValid: {
      get () {
        return this.isDataIntervalValid
      },
      set (newValue) {
        this.$store.commit('setDataIntervalValid', newValue)
      },
    },
    tcpSettingValid: {
      get () {
        return this.isTcpSettingValid
      },
      set (newValue) {
        this.$store.commit('setTcpSettingValid', newValue)
      },
    },
    tcpServerEnabled: {
      get () {
        return this.isTcpServerActivated
      },
      set (newValue) {
        this.$store.commit('setTcpServerActivated', newValue)
      },
    },
    tcpServerPort: {
      get () {
        return this.settingsTCPServerPort
      },
      set (newValue) {
        this.$store.commit('setTcpServerPort', newValue)
      },
    },
    udpSettingValid: {
      get () {
        return this.isUdpSettingValid
      },
      set (newValue) {
        this.$store.commit('setUdpSettingValid', newValue)
      },
    },
    udpPortNumber: {
      get () {
        return this.settingsUdpServerPort
      },
      set (newValue) {
        this.$store.commit('setUdpServerPort', newValue)
      },
    },
    udpDestinationIP: {
      get () {
        return this.settingsUdpServerIP
      },
      set (newValue) {
        this.$store.commit('setUdpServerIP', newValue)
      },
    },
    udpServerEnabled: {
      get () {
        return this.isUdpServerActivated
      },
      set (newValue) {
        this.$store.commit('setUdpServerActivated', newValue)
      },
    },
  },
  data: () => ({
    default_values,
    rules: {
      dataIntervalRule: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return '데이타 전송 인터벌 입력 필수'
        }

        let v = value

        if (v < default_values.dataIntervalMin || v > default_values.dataIntervalMax) {
            return `${default_values.dataIntervalMin} 이상 ${default_values.dataIntervalMax} 이하 이여야 함`
        }

        return true
      },
      tcpServerPortRule: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return 'TCP 서버 포트 입력 필수'
        }

        if (value <= default_values.tcpServerPortMin || value > default_values.tcpServerPortMax) {
          return `TCP 서버 포트 는 ${default_values.tcpServerPortMin} 보다 크고 ${default_values.tcpServerPortMax} 이하 이여야 함`
        }

        return true
      },
      udpPortNumber: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return 'UDP 서버 포트 입력 필수'
        }

        if (value <= default_values.udpPortMin || value > default_values.udpPortMax) {
          return `UDP 서버 포트 는 ${default_values.udpPortMin} 보다 크고 ${default_values.udpPortMax} 이하 이여야 함`
        }

        return true
      },
      udpDestinationIP: (value) => {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value))
        {
          return true
        }
        return '유효하지 않은 IP 주소'
      },
    },
  }),
  methods: {
    IntegerOnly(evt) {
      evt = (evt) ? evt : window.event;
      let charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        evt.preventDefault()
      } else {
        return true
      }
    },
  },
  mounted() {
    this.$refs.formDataInterval.validate()
    this.$refs.formTcpServer.validate();
    this.$refs.formUdpServer.validate();
  },
}
</script>