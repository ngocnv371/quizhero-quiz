<script>
import NavBarRoutes from './nav-bar-routes.vue'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      loggedInNavRoutes: [
        {
          name: 'home',
          title: 'Quizzes',
        },
        {
          name: 'questions',
          title: 'Questions',
        },
      ],
    }
  },
}
</script>

<template>
  <ul :class="$style.container">
    <NavBarRoutes v-if="$auth.isAuthenticated" :routes="loggedInNavRoutes" />
  </ul>
</template>

<style lang="scss" module>
@import '@design';

.container {
  padding: 0;
  margin: 0 0 $size-grid-padding;
  text-align: center;
  list-style-type: none;

  > li {
    display: inline-block;
    margin-right: $size-grid-padding;
  }
}
</style>
