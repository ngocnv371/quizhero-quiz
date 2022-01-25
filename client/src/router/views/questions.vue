<script>
import Layout from '@layouts/main.vue'
import QuestionsTable from '@components/questions-table.vue'

export default {
  page: {
    title: 'Questions',
    meta: [{ name: 'description', content: 'The Questions page.' }],
  },
  components: { Layout, QuestionsTable },
  computed: {
    initialQuizzes() {
      const q = this.$route.query.quizzes
      if (!q) {
        return []
      }
      return q.split(',').map((i) => Number(i))
    },
  },
}
</script>

<template>
  <Layout>
    <div style="min-height: 500px; align-self: start" class="mx-auto">
      <QuestionsTable :initial-quizzes="initialQuizzes" />
    </div>
  </Layout>
</template>
