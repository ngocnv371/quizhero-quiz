<script>
import Layout from '@layouts/main.vue'

export default {
  page: {
    title: 'Loading page...',
    meta: [{ name: 'description', content: 'Loading page...' }],
  },
  components: { Layout },
}
</script>

<template>
  <Layout>
    <Transition appear>
      <v-icon class="fa-spin">sync</v-icon>
    </Transition>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.loadingIcon {
  @extend %typography-xxlarge;

  display: block;
  margin: 0 auto;

  // stylelint-disable-next-line selector-class-pattern
  &:global(.v-enter-active) {
    transition: opacity 1s;
  }
  // stylelint-disable-next-line selector-class-pattern
  &:global(.v-enter) {
    opacity: 0;
  }
}
</style>
