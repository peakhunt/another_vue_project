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
              hint="최저 파고 데이타"
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
              hint="최고 파고 데이타"
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
              hint="최저 파주기 데이타"
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
              hint="최고 파주기 데이타"
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
              hint="최저 파향 데이타"
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
              hint="최고 파향 데이타"
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
              hint="랜덤 데이터 변경 주기"
              v-model.number="changeInterval"
              type="number"
              :rules="[rules.changeIntervalRule]"
              suffix="분"
              required
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
    rules: {
      minHeightRule: (value) => {
        return checkFloat(value, '최저 파고', (v) => {
          if( v < 0 || v > 20) {
            return `최저 파고 데이타는  0 이상 20 이하 여야 함`
          }
          return true
        })
      },
      maxHeightRule: (value) => {
        return checkFloat(value, '최고 파고', (v) => {
          if (v < 0 || v > 20) {
            return `최고 파고 데이타는  0 이상 20 이하 여야 함`
          }
          return true;
        })
      },
      minFrequencyRule: (value) => {
        return checkFloat(value, '최저 파주기', (v) => {
          if (v < 0 || v > 20) {
            return `최저 파주기 데이타는  0 이상 20 이하 여야 함`
          }
          return true;
        })
      },
      maxFrequencyRule: (value) => {
        return checkFloat(value, '최고 파주기', (v) => {
          if (v < 0 || v > 20) {
            return `최고 파주기 데이타는  0 이상 20 이하 여야 함`
          }
          return true;
        })
      },
      minDirectionRule: (value) => {
        return checkFloat(value, '최저 파향', (v) => {
          if (v < 0 || v >= 360) {
            return `최저 파향 데이타는  0 이상 360 미만 이어야 함`
          }
          return true;
        })
      },
      maxDirectionRule: (value) => {
        return checkFloat(value, '최고 파향', (v) => {
          if (v < 0 || v >= 360) {
            return `최고 파향 데이타는  0 이상 360 미만 이어야 함`
          }
          return true;
        })
      },
      changeIntervalRule: (value) => {
        return checkFloat(value, '변경 주기', (v) => {
          if (v < 0.01 || v > 100) {
            return `변경 주기 데이타는  0.01 이상 100 이하 여야 함`
          }
          return true;
        })
      },
    },
  }),
  methods: {
  },
  mounted() {
    this.$refs.form1.validate();
  }
}
</script>