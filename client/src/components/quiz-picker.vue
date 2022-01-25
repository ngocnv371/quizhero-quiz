<script>
import { mapActions, mapGetters } from 'vuex'
import forwardModel from '@src/mixins/forward-model'
import { debounce } from 'lodash'

export default {
  name: 'QuizPicker',
  mixins: [forwardModel],
  props: {
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      search: '',
      loading: false,
      error: '',
    }
  },
  computed: {
    ...mapGetters('quizzes', { cachedItems: 'items' }),
    pendingItems() {
      const targets = !this.localValue
        ? []
        : this.localValue.length
        ? this.localValue
        : [this.localValue]
      const repo = [...this.cachedItems, ...this.items]
      // items we need to display but are not in loaded
      const strandedItems = targets.filter((t) => !repo.find((i) => i.id === t))
      return strandedItems
    },
  },
  watch: {
    search: debounce(function() {
      this.updateSearch()
    }, 1000),
    value() {
      this.updateSearch()
    },
  },
  methods: {
    ...mapActions('quizzes', {
      searchQuizzes: 'loadQuizzes',
      findQuizzesByIds: 'findQuizzesByIds',
    }),
    async updateSearch() {
      if (!this.query && !this.pendingItems.length && this.items.length) {
        return
      }
      if (this.loading) {
        return
      }
      try {
        this.loading = true
        if (this.query || !this.pendingItems.length) {
          const data = await this.searchQuizzes({
            take: 20,
            query: this.search,
          })
          this.items = data.items
        }
        if (this.pendingItems.length) {
          const strandedItems = await this.findQuizzesByIds({
            ids: this.pendingItems,
          })
          this.items = [...this.items, ...strandedItems]
        }
      } catch (error) {
        this.error = error
        console.log(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <v-autocomplete
    v-model="localValue"
    :items="items"
    :multiple="multiple"
    :search-input.sync="search"
    :loading="loading"
    :error-count="error ? 1 : 0"
    :error="error ? true : false"
    :error-messages="error ? [error] : []"
    flat
    hide-no-data
    hide-details
    label="Quiz"
    item-text="name"
    item-value="id"
    class="quiz-picker"
  >
    <template v-if="multiple" v-slot:selection="data">
      <span
        v-if="localValue.length === 1"
        class="pr-2 selection"
        v-text="data.item.name"
      ></span>
      <span
        v-else-if="data.index === 0"
        class="pr-2"
        v-text="`${localValue.length} items`"
      ></span>
    </template>
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title v-text="data.item.name"></v-list-item-title>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<style lang="scss" scoped>
@import '@design';

.quiz-picker .selection {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
