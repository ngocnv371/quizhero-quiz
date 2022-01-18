<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main.vue'
import QuizzesTable from '@components/quizzes-table.vue'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, QuizzesTable },
}
</script>

<template>
  <Layout>
    <div style="min-height: 500px; align-self: start" class="mx-auto">
      <QuizzesTable />
    </div>
  </Layout>
</template>
