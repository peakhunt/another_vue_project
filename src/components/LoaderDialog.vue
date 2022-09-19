<template>
  <v-dialog
    :value="value"
    persistent
    max-width="300"
  >
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        {{ msg }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        >
        </v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoaderDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: String,
      default: 'Please stand by',
    }
  },
}
</script>