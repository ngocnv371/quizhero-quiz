<script>
import { mapActions, mapState } from 'vuex'
import { debounce } from 'lodash'
import TopicPicker from './topic-picker.vue'
import TopicLabel from './topic-label.vue'
import StatusLabel from './status-label.vue'
import QuizPicker from './quiz-picker.vue'

export default {
  name: 'QuestionsTable',
  components: { TopicPicker, TopicLabel, StatusLabel, QuizPicker },
  props: {
    initialQuizzes: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: true,
        value: 'id',
      },
      { text: 'Text', value: 'text' },
      { text: 'Quiz', value: 'quizId' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    validForm: false,
    localSearch: '',
    loading: false,
    topics: [],
    quizzes: [],
    error: '',
    options: {
      itemsPerPage: 20,
      page: 1,
      sortBy: ['id'],
      sortDesc: [false],
    },
    editedIndex: -1,
    editedItem: {
      id: 0,
      text: '',
      choice0: '',
      choice1: '',
      choice2: '',
      choice3: '',
      correct0: false,
      correct1: false,
      correct2: false,
      correct3: false,
      quizId: 0,
      createdById: 0,
      createdAt: 0,
    },
    defaultItem: {
      id: 0,
      text: '',
      choice0: '',
      choice1: '',
      choice2: '',
      choice3: '',
      correct0: false,
      correct1: false,
      correct2: false,
      correct3: false,
      quizId: 0,
      createdById: 0,
      createdAt: 0,
    },
  }),

  computed: {
    ...mapState('questions', ['items', 'search', 'take', 'total']),
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    options: {
      deep: true,
      handler() {
        this.reload()
      },
    },
    localSearch: debounce(function() {
      this.reload()
    }, 1000),
    topics: {
      deep: true,
      handler() {
        this.reload()
      },
    },
    quizzes: {
      deep: true,
      handler() {
        this.reload()
      },
    },
  },

  async mounted() {
    this.quizzes = this.initialQuizzes
    await this.reload()
  },

  methods: {
    ...mapActions('questions', [
      'loadQuestions',
      'updateQuestion',
      'createQuestion',
      'deleteQuestion',
    ]),
    async reload() {
      const skip = (this.options.page - 1) * this.options.itemsPerPage
      const take = this.options.itemsPerPage
      const sort = this.options.sortBy.length ? this.options.sortBy[0] : 'name'
      const order =
        this.options.sortDesc.length && this.options.sortDesc[0]
          ? 'desc'
          : 'asc'
      const query = this.localSearch
      const topicsList = this.topics.join(',')
      const quizzesList = this.quizzes.join(',')
      this.loading = true
      try {
        await this.loadQuestions({
          skip,
          take,
          query,
          sort,
          order,
          topics: topicsList,
          quizzes: quizzesList,
        })
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      try {
        this.loading = true
        await this.deleteQuestion(this.editedItem)
        this.closeDelete()
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      this.loading = true
      try {
        if (this.editedItem.id) {
          await this.updateQuestion(this.editedItem)
        } else {
          await this.createQuestion(this.editedItem)
        }
        this.close()
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :server-items-length="total"
    :options.sync="options"
    :loading="loading"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Questions</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="localSearch"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          style="width: 300px"
        ></v-text-field>
        <TopicPicker
          v-model="topics"
          multiple
          class="pl-2"
          style="width: 300px"
        />
        <QuizPicker
          v-model="quizzes"
          multiple
          class="pl-2"
          style="width: 300px"
        ></QuizPicker>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px" :persistent="loading">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-form v-model="validForm">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <QuizPicker
                        v-model="editedItem.quizId"
                        label="Text"
                      ></QuizPicker>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.text"
                        label="Text"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <v-checkbox
                        v-model="editedItem.correct0"
                        on-icon="check-square"
                        off-icon="square"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="10">
                      <v-text-field
                        v-model="editedItem.choice0"
                        label="Choice 1"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <v-checkbox
                        v-model="editedItem.correct1"
                        on-icon="check-square"
                        off-icon="square"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="10">
                      <v-text-field
                        v-model="editedItem.choice1"
                        label="Choice 2"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <v-checkbox
                        v-model="editedItem.correct2"
                        on-icon="check-square"
                        off-icon="square"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="10">
                      <v-text-field
                        v-model="editedItem.choice2"
                        label="Choice 3"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <v-checkbox
                        v-model="editedItem.correct3"
                        on-icon="check-square"
                        off-icon="square"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="10">
                      <v-text-field
                        v-model="editedItem.choice3"
                        label="Choice 4"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text :disabled="loading" @click="close">
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                text
                :disabled="!validForm"
                :loading="loading"
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
          :persistent="loading"
        >
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-text v-if="error">
              <v-alert dense outlined type="error">
                <p v-text="error"></p>
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text :disabled="loading" @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="error"
                text
                :loading="loading"
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.topicId="{ item }">
      <TopicLabel :id="item.topicId" />
    </template>
    <template v-slot:item.statusId="{ item }">
      <StatusLabel :id="item.statusId" />
    </template>
    <template v-slot:item.createdById="{ item }">
      <v-avatar size="36">
        <img :src="`https://i.pravatar.cc/300?${item.id}`" alt="avatar" />
      </v-avatar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" :disabled="loading" @click="editItem(item)">
        edit
      </v-icon>
      <v-icon small :disabled="loading" @click="deleteItem(item)">
        trash
      </v-icon>
    </template>
  </v-data-table>
</template>
