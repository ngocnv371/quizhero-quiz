<script>
import Layout from '@layouts/main.vue'
import QuestionsTable from '@components/questions-table.vue'

export default {
  page: {
    title: 'Questions',
    meta: [{ name: 'description', content: 'The Questions page.' }],
  },
  components: { Layout, QuestionsTable },
}
</script>

<template>
  <Layout>
    <div style="min-height: 500px; align-self: start" class="mx-auto">
      <QuestionsTable />
    </div>
  </Layout>
</template>
