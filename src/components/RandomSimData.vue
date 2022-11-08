<template>
  <v-card dark class="flex-grow-1">
    <v-card-title class="text-h5">
      랜덤 파고 데이터 설정
    </v-card-title>
    <v-card-subtitle>
      랜덤 파고 데이터 설정
    </v-card-subtitle>
    <v-card-text>
      <v-form v-model="randomDataValid" ref="form1">
        <v-row>
          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="최처 파고"
              :hint="`최저 파고 데이타. ${default_values.waveHeightMin} 이상 ${default_values.waveHeightMax} 이하`"
              v-model.number="minHeight"
              type="number"
              :rules="[rules.minHeightRule]"
              suffix="미터"
              required
              :readonly="readonly"
            />
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="최고 파고"
              :hint="`최고 파고 데이타. ${default_values.waveHeightMin} 이상 ${default_values.waveHeightMax} 이하`"
              v-model.number="maxHeight"
              type="number"
              :rules="[rules.maxHeightRule]"
              suffix="미터"
              required
              :readonly="readonly"
            />
           </v-col>

          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="최처 파주기"
              :hint="`최저 파주기 데이타. ${default_values.waveFrequencyMin} 이상 ${default_values.waveFrequencyMax} 이하`"
              v-model.number="minFrequency"
              type="number"
              :rules="[rules.minFrequencyRule]"
              suffix="초"
              required
              :readonly="readonly"
            />
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="최고 파주기"
              :hint="`최고 파주기 데이타. ${default_values.waveFrequencyMin} 이상 ${default_values.waveFrequencyMax} 이하`"
              v-model.number="maxFrequency"
              type="number"
              :rules="[rules.maxFrequencyRule]"
              suffix="초"
              required
              :readonly="readonly"
            />
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="최처 파향"
              :hint="`최저 파향 데이타. ${default_values.waveDirectionMin} 이상 ${default_values.waveDirectionMax} 미만`"
              v-model.number="minDirection"
              type="number"
              :rules="[rules.minDirectionRule]"
              suffix="°"
              required
              :readonly="readonly"
            />
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="최고 파향"
              :hint="`최고 파향 데이타. ${default_values.waveDirectionMin} 이상 ${default_values.waveDirectionMax} 미만`"
              v-model.number="maxDirection"
              type="number"
              :rules="[rules.maxDirectionRule]"
              suffix="°"
              required
              :readonly="readonly"
            />
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="변경 주기"
              :hint="`랜덤 데이터 변경 주기. ${default_values.changeIntervalMin} 이상 ${default_values.changeIntervalMax}`"
              v-model.number="changeInterval"
              type="number"
              :rules="[rules.changeIntervalRule]"
              suffix="초"
              required
              @keypress="IntegerOnly"
              :readonly="readonly"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import checkFloat from '@/utils/checkFloat'
import default_values from '@/utils/default_values'

export default {
  name: 'RandomSimData',
  props: {
    readonly: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapGetters([
      'isRandomDataValid',
      'settingsRandMinHeight',
      'settingsRandMaxHeight',
      'settingsRandMinFrequency',
      'settingsRandMaxFrequency',
      'settingsRandMinDirection',
      'settingsRandMaxDirection',
      'settingsRandChangeInterval',
    ]),
    randomDataValid: {
      get () {
        return this.isRandomDataValid
      },
      set (newValue) {
        this.$store.commit('setRandomDataValid', newValue)
      },
    },
    minHeight: {
      get () {
        return this.settingsRandMinHeight
      },
      set (newValue) {
        this.$store.commit('setRandDataMinHeight', newValue)
      },
    },
    maxHeight: {
      get () {
        return this.settingsRandMaxHeight
      },
      set (newValue) {
        this.$store.commit('setRandDataMaxHeight', newValue)
      },
    },
    minFrequency: {
      get () {
        return this.settingsRandMinFrequency
      },
      set (newValue) {
        this.$store.commit('setRandDataMinFrequency', newValue)
      },
    },
    maxFrequency: {
      get () {
        return this.settingsRandMaxFrequency
      },
      set (newValue) {
        this.$store.commit('setRandDataMaxFrequency', newValue)
      },
    },
    minDirection: {
      get () {
        return this.settingsRandMinDirection
      },
      set (newValue) {
        this.$store.commit('setRandDataMinDirection', newValue)
      },
    },
    maxDirection: {
      get () {
        return this.settingsRandMaxDirection
      },
      set (newValue) {
        this.$store.commit('setRandDataMaxDirection', newValue)
      },
    },
    changeInterval: {
      get () {
        return this.settingsRandChangeInterval
      },
      set (newValue) {
        this.$store.commit('setRandDataChangeInterval', newValue)
      },
    },
  },
  data: () => ({
    default_values,
    rules: {
      minHeightRule: (value) => {
        return checkFloat(value, '최저 파고', (v) => {
          if( v < default_values.waveHeightMin || v > default_values.waveHeightMax) {
            return `최저 파고 데이타는 ${default_values.waveHeightMin} 이상 ${default_values.waveHeightMax} 이하 여야 함`
          }
          return true
        })
      },
      maxHeightRule: (value) => {
        return checkFloat(value, '최고 파고', (v) => {
          if (v < default_values.waveHeightMin || v > default_values.waveHeightMax) {
            return `최고 파고 데이타는 ${default_values.waveHeightMin} 이상 ${default_values.waveHeightMax} 이하 여야 함`
          }
          return true;
        })
      },
      minFrequencyRule: (value) => {
        return checkFloat(value, '최저 파주기', (v) => {
          if (v < default_values.waveFrequencyMin || v > default_values.waveFrequencyMax) {
            return `최저 파주기 데이타는 ${default_values.waveFrequencyMin} 이상 ${default_values.waveFrequencyMax} 이하 여야 함`
          }
          return true;
        })
      },
      maxFrequencyRule: (value) => {
        return checkFloat(value, '최고 파주기', (v) => {
          if (v < default_values.waveFrequencyMin || v > default_values.waveFrequencyMax) {
            return `최고 파주기 데이타는 ${default_values.waveFrequencyMin} 이상 ${default_values.waveFrequencyMax} 이하 여야 함`
          }
          return true;
        })
      },
      minDirectionRule: (value) => {
        return checkFloat(value, '최저 파향', (v) => {
          if (v < default_values.waveDirectionMin || v >= default_values.waveDirectionMax) {
            return `최저 파향 데이타는 ${default_values.waveDirectionMin} 이상 ${default_values.waveDirectionMax} 미만 이어야 함`
          }
          return true;
        })
      },
      maxDirectionRule: (value) => {
        return checkFloat(value, '최고 파향', (v) => {
          if (v < default_values.waveDirectionMin || v >= default_values.waveDirectionMax) {
            return `최고 파향 데이타는 ${default_values.waveDirectionMin} 이상 ${default_values.waveDirectionMax} 미만 이어야 함`
          }
          return true;
        })
      },
      changeIntervalRule: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return '변경 주기 입력 필수'
        }

        let v = value

        if (v < default_values.changeIntervalMin || v > default_values.changeIntervalMax) {
          return `변경 주기 데이타는 ${default_values.changeIntervalMin} 이상 ${default_values.changeIntervalMax} 이하 여야 함`
        }

        return true
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
    this.$refs.form1.validate();
  }
}
</script>