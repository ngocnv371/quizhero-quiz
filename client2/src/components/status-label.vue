<script>
const statuses = [
  { id: 1, text: 'Draft', color: '' },
  { id: 2, text: 'Pending', color: 'secondary' },
  { id: 3, text: 'Approved', color: 'primary' },
  { id: 4, text: 'Rejected', color: 'error' },
  { id: 5, text: 'Deleted', color: 'pink' },
]
export default {
  name: 'StatusLabel',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  computed: {
    text() {
      return statuses[this.id - 1].text
    },
    color() {
      return statuses[this.id - 1].color
    },
  },
}
</script>

<template>
  <v-chip :color="color" v-text="text"> </v-chip>
</template>
