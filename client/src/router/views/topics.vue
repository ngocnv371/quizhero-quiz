<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main.vue'
import TopicsTable from '@components/topics-table.vue'

export default {
  page: {
    title: 'Topics',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, TopicsTable },
}
</script>

<template>
  <Layout>
    <div style="min-height: 500px; align-self: start" class="mx-auto">
      <TopicsTable />
    </div>
  </Layout>
</template>
