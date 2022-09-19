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
                  hint="파고 미터 단위 입력"
                  v-model.number="tempItem.height"
                  type="number"
                  :rules="[rules.heightRule]"
                  required
                  suffix="미터"></v-text-field>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="파주기(Hz)"
                  hint="파주기 입력"
                  v-model.number="tempItem.frequency"
                  type="number"
                  :rules="[rules.frequencyRule]"
                  required
                  suffix="Hz"></v-text-field>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="파향(각도)"
                  hint="파향 각도 입력"
                  v-model.number="tempItem.direction"
                  type="number"
                  :rules="[rules.directionRule]"
                  required
                  suffix="도"></v-text-field>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="Duration(분)"
                  hint="Duration 분단위 입력"
                  v-model.number="tempItem.duration"
                  type="number"
                  :rules="[rules.durationRule]"
                  required
                  suffix="분"></v-text-field>
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
    defaultItem: {
      height: 0,
      frequency: 0,
      direction: 0,
      duration: 5,
    },
    tempItem: {
      height: 0,
      frequency: 0,
      direction: 0,
      duration: 5,
    },
    rules: {
      heightRule: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return '파고 데이타 입력 필수'
        }

        if ((typeof(value) == 'string' && parseFloat(value) < 0) ||
            (typeof(value) == 'number' && value < 0)) {
          return '파고 데이타는 0 이상 이어야 함'
        }

        return true
      },
      frequencyRule: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return '파주기 데이타 입력 필수'
        }

        if ((typeof(value) == 'string' && parseFloat(value) < 0) ||
            (typeof(value) == 'number' && value < 0)) {
          return '파주기 데이타는 0 이상 이어야 함'
        }

        return true
      },
      directionRule: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return '파향 데이타 입력 필수'
        }

        if ((typeof(value) == 'string' && (parseFloat(value) < 0 || parseFloat(value) >= 360)) ||
            (typeof(value) == 'number' && (value < 0 || value >= 360))) {
          return '파향 데이타는 0 이상 360 미만이어야 함'
        }

        return true
      },
      durationRule: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return 'Duration 데이타 입력 필수'
        }

        if ((typeof(value) == 'string' && parseFloat(value) <= 0) ||
            (typeof(value) == 'number' && value <= 0)) {
          return 'Duration 데이타는 0 보다 커야 함'
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
  }
}
</script>