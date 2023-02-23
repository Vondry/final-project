<template>
  <j-page
    :loading="loading"
    :title="person ? person.last + ' ' + person.first + ' (' + person.position + ')' : ''"
  >
    <template v-slot:content>
      <div class="top-buttons">
        <j-button label="edit" @clicked="onEditButtonClicked"/>
        <j-button v-if="!tasks.length" label="delete" @clicked="onDeleteButtonClicked" />
        <j-button label="add task" @click="onAddTaskClicked" />
      </div>
      <div>
        <j-list
          :items="tasksToDisplay"
          display-icons
          @clicked="onItemButtonClicked"
        />
      </div>
    </template>
  </j-page>
  <j-modal
    :show="showDeleteModal"
    title="confirm person delete"
    ok-button-label="delete"
    @close-me="closeDeleteModal"
    @ok-clicked="deletePerson"
    @cancel-clicked="closeDeleteModal"
  >
    <div>
      <span>do you really want to delete this person </span>
      <strong>{{ person.last + ' ' + person.first }}</strong>
      <span> ?</span>
    </div>
  </j-modal>
  <j-modal
    :show="showAddTaskModal"
    title="add task"
    ok-button-label="submit"
    @close-me="closeAddTaskModal"
    @cancel-clicked="closeAddTaskModal"
    @ok-clicked="addTask">
    <div>
      <j-input
        control="addTask"
        :settings="addTaskSettings"
        @changed="onAddTaskChanged" />
    </div>
  </j-modal>
</template>

<script>
import db from '../helpers/db'
import { isPast, formatDate} from '../helpers/dateFunction'
import { sortingTasks } from '@/helpers/sorting';
import JList from '@/components/JList.vue';
import JPage from '@/components/JPage.vue';
import JModal from '@/components/JModal.vue';
import JButton from '@/components/JButton.vue';
import JInput from '@/components/form/JInput.vue';

export default {
  name: 'PersonDetailPage',
  data () {
    return {
      person: null,
      loading: true,
      tasks: null,
      showDeleteModal: false,
      showAddTaskModal: false,
      addTaskSettings: {
        type: 'select',
        options: []
      },
      taskidToAdd: null
    }
  },
  computed: {
    personid () {
      return this.$route.params.id
    },
    tasksToDisplay () {
      return this.tasks
        .slice()
        .sort(sortingTasks)
        .map(task => {
          let icon = ''
          let color = ''
          const buttons = [task.completed ? 'undone' : 'done', 'remove', 'edit']
          if (task.completed) {
            icon = 'check',
            color = 'green'
          } else if (isPast(task.date)) {
            icon = 'warning',
            color = 'red'
          }
          return {
            id: task.taskid,
            header: task.task,
            subtitle: formatDate(task.date),
            icon: { icon, color },
            buttons,
            date: task.date,
            task: task.task,
            completed: task.completed
          }
        }).sort(sortingTasks)
    }
  },
  created () {
    const promises = [
      db.get('js4persons/' + this.personid).then(record => {
        this.person = record
      }),
      this.fetchTasks()
    ]
    Promise.all(promises).then(() => {
      this.loading = false
    })
  },
  methods: {
    fetchTasks () {
      return db.get('js4personstasks?personid=' + this.personid).then((tasks) => {
        this.tasks = tasks
      })
    },
    onEditButtonClicked () {
      this.$router.push('/personform/' + this.personid)
    },
    onDeleteButtonClicked () {
      this.showDeleteModal = true
    },
    closeDeleteModal () {
      this.showDeleteModal = false
    },
    deletePerson () {
      db.delete('js4persons', { id: this.personid }).then(() => {
        this.closeDeleteModal()
        this.$router.push('/persons')
      })
    },
    onItemButtonClicked (payload) {
      if (payload.button === 'edit') {
        this.$router.push('/taskform/' + payload.item.id)
      } else if (payload.button === 'remove') {
        const obj = this.tasks.find((item) => {
          return ('' + item.personid === '' + this.personid) && ('' + item.taskid === '' + payload.item.id)
        })
        db.delete('js4personstasks', { id: obj.id }).then(() => {
          this.fetchTasks()
        })
      } else {
        const completed = payload.button === 'done' ? 1 : 0
        db.put('js4tasks', { id: payload.item.id, completed }).then(() => {
          db.get('js4tasks/' + payload.item.id).then((record) => {
            this.tasks.find(task => task.taskid === payload.item.id).completed = record.completed
          })
        })
      }
    },
    onAddTaskClicked () {
      console.log('spustila se funkce add on task clicked')
      db.get('js4tasks').then((allTasks) => {
        const tasksFiltered = allTasks.filter(taskFromAll => {
          return !this.tasks.some(item => {
            return '' + item.taskid === '' + taskFromAll.id
          })
        })
        this.addTaskSettings.options = tasksFiltered.map(task => {
          return {
            value: task.id,
            label: task.task + ' (' + task.project + ')'
          }
        })
        this.addTaskSettings.options.unshift({ value: '', label: '' })
      }).then(() => {
        this.taskidToAdd = null
        this.showAddTaskModal = true
      })
    },
    closeAddTaskModal () {
      this.showAddTaskModal = false
    },
    onAddTaskChanged (payload) {
      this.taskidToAdd = payload.value
    },
    addTask () {
      db.post('js4personstasks', { personid: this.personid, taskid: this.taskidToAdd }).then(() => {
        this.fetchTasks().then(() => {
          this.closeAddTaskModal()
        })
      })
    }
  },
  components: { JPage, JButton, JModal, JList, JInput }
}


</script>


<style lang="stylus" scoped>
@import '../styles/variables.styl'

.top-buttons
  display: flex
  gap: 1rem
  justify-content: center
  margin-bottom: $margin


</style>