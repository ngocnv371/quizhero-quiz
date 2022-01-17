<script>
import { mapGetters } from 'vuex'
import forwardModel from '@src/mixins/forward-model'

export default {
  name: 'TopicPicker',
  mixins: [forwardModel],
  computed: {
    ...mapGetters('topics', ['topics']),
  },
}
</script>

<template>
  <v-autocomplete
    v-model="localValue"
    :items="topics"
    flat
    hide-no-data
    hide-details
    label="Topic"
    item-text="name"
    item-value="id"
  ></v-autocomplete>
</template>
