<script>
import { mapGetters } from 'vuex'
export default {
  name: 'StatusLabel',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters('statuses', ['statuses']),
    text() {
      return this.statuses.find((s) => s.id === this.id).name
    },
    color() {
      return this.statuses.find((s) => s.id === this.id).color
    },
  },
}
</script>

<template>
  <v-chip :color="color" v-text="text"> </v-chip>
</template>
