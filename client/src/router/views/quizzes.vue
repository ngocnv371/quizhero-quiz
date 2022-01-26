<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main.vue'
import QuizzesTable from '@components/quizzes-table.vue'

export default {
  page: {
    title: 'Quizzes',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, QuizzesTable },
  computed: {
    initialTopics() {
      const q = this.$route.query.topics
      if (!q) {
        return []
      }
      if (typeof q === 'number') {
        return [q]
      }
      return q.split(',').map((i) => Number(i))
    },
  },
}
</script>

<template>
  <Layout>
    <div style="min-height: 500px; align-self: start" class="mx-auto">
      <QuizzesTable :initial-topics="initialTopics" />
    </div>
  </Layout>
</template>
