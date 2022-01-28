<script>
import { mapActions } from 'vuex'
export default {
  name: 'QuizLabel',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      item: null,
    }
  },
  computed: {
    label() {
      return this.item ? this.item.name : ''
    },
  },
  watch: {
    id: {
      immediate: true,
      async handler() {
        const data = await this.findQuizzesByIds({ ids: [this.id] })
        this.item = data[0]
      },
    },
  },
  methods: {
    ...mapActions('quizzes', {
      findQuizzesByIds: 'findQuizzesByIds',
    }),
  },
}
</script>

<template>
  <span v-text="label"></span>
</template>
