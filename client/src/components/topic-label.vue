<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopicLabel',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters('topics', ['items']),
    label() {
      const topic = this.items.find((i) => i.id === this.id)
      return topic ? topic.name : ''
    },
  },
}
</script>

<template>
  <span v-text="label"></span>
</template>
