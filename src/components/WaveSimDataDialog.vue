<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card >
      <v-toolbar color="primary" dark v-if="editMode === false">
        데이타 추가
      </v-toolbar>
      <v-toolbar color="primary" dark v-if="editMode === true">
        데이타 수정
      </v-toolbar>

      <v-card-text>
        <v-container>
          <v-form v-model="inputValid">
            <v-row>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="파고(미터)"
                  :hint="`파고 데이타. ${default_values.waveHeightMin} 이상 ${default_values.waveHeightMax} 이하`"
                  v-model.number="tempItem.height"
                  type="number"
                  :rules="[rules.heightRule]"
                  required
                  suffix="미터"></v-text-field>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="파주기(초)"
                  :hint="`파주기 데이타. ${default_values.waveFrequencyMin} 이상 ${default_values.waveFrequencyMax} 이하`"
                  v-model.number="tempItem.frequency"
                  type="number"
                  :rules="[rules.frequencyRule]"
                  required
                  suffix="초"></v-text-field>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="파향(각도)"
                  :hint="`파향 데이타. ${default_values.waveDirectionMin} 이상 ${default_values.waveDirectionMax} 미만`"
                  v-model.number="tempItem.direction"
                  type="number"
                  :rules="[rules.directionRule]"
                  required
                  suffix="도"></v-text-field>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="Duration(초)"
                  :hint="`Duration 데이타. ${default_values.dataDurationMin} 이상 ${default_values.dataDurationMax} 이하`"
                  v-model.number="tempItem.duration"
                  type="number"
                  :rules="[rules.durationRule]"
                  required
                  @keypress="IntegerOnly"
                  suffix="초"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" v-if="editMode === false" :disabled="!inputValid" @click.stop="onClickAdd()">
          추가
        </v-btn>
        <v-btn color="primary" v-if="editMode === true" :disabled="!inputValid" @click.stop="onClickMod()">
          변경
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import checkFloat from '@/utils/checkFloat'
import default_values from '@/utils/default_values'

export default {
  name: 'WaveSimDataDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    }
  },
  data: () => ({
    inputValid: false,
    default_values,
    defaultItem: {
      height: 0,
      frequency: 0,
      direction: 0,
      duration: 600,
    },
    tempItem: {
      height: 0,
      frequency: 0,
      direction: 0,
      duration: 600,
    },
    rules: {
      heightRule: (value) => {
        return checkFloat(value, '파고 데이타', (v) => {
          if( v < default_values.waveHeightMin || v > default_values.waveHeightMax) {
            return `파고 데이타는 ${default_values.waveHeightMin} 이상 ${default_values.waveHeightMax} 이하 여야 함`
          }
          return true
        })
      },
      frequencyRule: (value) => {
        return checkFloat(value, '파주기 데이타', (v) => {
          if (v < default_values.waveFrequencyMin || v > default_values.waveFrequencyMax) {
            return `파주기 데이타는 ${default_values.waveFrequencyMin} 이상 ${default_values.waveFrequencyMax} 이하 여야 함`
          }
          return true;
        })
      },
      directionRule: (value) => {
        return checkFloat(value, '파향 데이타', (v) => {
          if (v < default_values.waveDirectionMin || v >= default_values.waveDirectionMax) {
            return `파향 데이타는 ${default_values.waveDirectionMin} 이상 ${default_values.waveDirectionMax} 미만 이어야 함`
          }
          return true;
        })
      },
      durationRule: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return 'Duration 데이타 입력 필수'
        }

        let v = value

        if (v < default_values.changeIntervalMin || v > default_values.changeIntervalMax) {
            return `Duration 데이타는 ${default_values.dataDurationMin} 이상 ${default_values.dataDurationMax} 이하 이어야 함`
        }

        return true
      },
    },
  }),
  mounted() {
    if (this.editMode === true) {
      this.tempItem.height = this.item.height;
      this.tempItem.frequency = this.item.frequency;
      this.tempItem.direction = this.item.direction;
      this.tempItem.duration = this.item.duration;
    } else {
      this.tempItem.height = this.defaultItem.height;
      this.tempItem.frequency = this.defaultItem.frequency;
      this.tempItem.direction = this.defaultItem.direction;
      this.tempItem.duration = this.defaultItem.duration;
    }
  },
  methods: {
    onClickAdd() {
      this.$emit('add', this.tempItem);
    },
    onClickMod() {
      // console.log(JSON.stringify(this.tempItem));
      this.$emit('mod', { old: this.item, mod: this.tempItem});
    },
    IntegerOnly(evt) {
      evt = (evt) ? evt : window.event;
      let charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        evt.preventDefault()
      } else {
        return true
      }
    },
  }
}
</script>