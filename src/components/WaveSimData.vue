<template>
  <v-card dark rounded>
    <v-card-title class="text-h5">시뮬레이션 데이타</v-card-title>
    <v-card-subtitle>시뮬레이션 데이타 조회 및 수정</v-card-subtitle>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="simDataList"
        :hide-default-footer="true"
        @click:row="onRowClick"
      >
        <template v-slot:top>
          <v-toolbar flat dense color="transparent">
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{on, attrs}">
                <v-btn text icon color="red lighten-2" v-on="on" v-bind="attrs" :disabled="readonly">
                  <v-icon x-large dark @click.stop="onNewItem()">add</v-icon>
                </v-btn>
              </template>
              <span>새로운 항목 추가</span>
            </v-tooltip>
          </v-toolbar>
          <WaveSimDataDialog
            v-if="dialogData.showAdd"
            v-model="dialogData.showAdd"
            :editMode="false"
            :item="dialogData.item"
            @add="addNewItem"
          >
          </WaveSimDataDialog>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-icon small v-on="on" v-bind="attrs" :disabled="isItemTop(item)||readonly" @click.stop="$store.dispatch('moveItemUp', item)">keyboard_arrow_up</v-icon>
            </template>
            <span>위로 옮김</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-icon small v-on="on" v-bind="attrs" :disabled="isItemBottom(item)||readonly" @click.stop="$store.dispatch('moveItemDown', item)">keyboard_arrow_down</v-icon>
            </template>
            <span>아래로 옮김</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-icon small v-on="on" v-bind="attrs" :disabled="readonly" @click.stop="$store.dispatch('removeItem', item)">delete</v-icon>
            </template>
            <span>삭제</span>
          </v-tooltip>
          <WaveSimDataDialog
            v-if="dialogData.showMod"
            v-model="dialogData.showMod"
            :editMode="true"
            :item="dialogData.item"
            @mod="modifyItem"
          >
          </WaveSimDataDialog>

        </template>
      </v-data-table>

    </v-card-text>
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex';
import WaveSimDataDialog from '@/components/WaveSimDataDialog.vue'

export default {
  name: 'WaveSimData',
  components: {
    WaveSimDataDialog,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      'simDataList',
      'isItemTop',
      'isItemBottom',
    ]),
  },
  data: () => ({
		headers: [
      {
        sortable: false,
        text: '파고 (meters)',
        value: 'height',
      },
      {
        sortable: false,
        text: '파주기 (per sec)',
        value: 'frequency',
      },
      {
        sortable: false,
        text: '파향 (degree)',
        value: 'direction',
      },
      {
        sortable: false,
        text: 'Duration (minutes)',
        value: 'duration',
      },
      {
        sortable: false,
        text: 'Actions',
        value: 'actions',
      },
    ],
    dialogData: {
      showAdd: false,
      showMod: false,
      item: null,
    }
  }),
  methods: {
    onRowClick(item) {
      if (this.readonly) {
        return
      }

      this.dialogData.item = item;
      this.dialogData.showMod = true;
    },
    onNewItem() {
      this.dialogData.item = null;
      this.dialogData.showAdd = true;
    },
    addNewItem(item) {
      this.$store.dispatch('addNewItem', item);
      this.dialogData.showAdd = false;
    },
    modifyItem({ old, mod }) {
      this.$store.dispatch('modifyItem', { old, mod });
      this.dialogData.showMod = false;
    }
  },
}
</script>
