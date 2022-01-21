<script>
import { mapGetters } from 'vuex'
import forwardModel from '@src/mixins/forward-model'

export default {
  name: 'TopicPicker',
  mixins: [forwardModel],
  props: {
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapGetters('topics', ['topics']),
  },
}
</script>

<template>
  <v-autocomplete
    v-model="localValue"
    :items="topics"
    :multiple="multiple"
    flat
    hide-no-data
    hide-details
    label="Topic"
    item-text="name"
    item-value="id"
  >
    <template v-if="multiple" v-slot:selection="data">
      <span
        v-if="localValue.length === 1"
        class="pr-2"
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
