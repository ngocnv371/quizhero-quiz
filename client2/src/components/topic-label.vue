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
    ...mapGetters('topics', ['topics']),
    label() {
      const topic = this.topics.find((i) => i.id === this.id)
      return topic.name
    },
  },
}
</script>

<template>
  <span v-text="label"></span>
</template>
