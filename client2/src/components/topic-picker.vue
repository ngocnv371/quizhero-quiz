<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TopicPicker',
  computed: {
    ...mapGetters('topics', ['topics']),
  },
}
</script>

<template>
  <div />
</template>
