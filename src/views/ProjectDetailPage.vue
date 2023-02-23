<template>
  <j-page
    :title="project ? project.project : ''"
    :loading="loading"
  >
    <template v-slot:content>
      <div class="top-buttons">
        <j-button label="edit" @clicked="onEditButtonClicked"/>
        <j-button label="add task" @clicked="onAddTaskButtonClicked" />
        <j-button v-if="!tasks.length" label="delete project" @clicked="onDeleteButtonClicked" />
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
    title="confirm project delete"
    ok-button-label="delete"
    @close-me="closeDeleteModal"
    @ok-clicked="deleteProject"
    @cancel-clicked="closeDeleteModal"
  >
    <div>
      <span>do you really want to delete project </span>
      <strong>{{ project.project }}</strong>
      <span> ?</span>
    </div>
  </j-modal>

</template>

<script>
import db from '../helpers/db.js'
import { formatDate, isPast } from '../helpers/dateFunction'
import JPage from '../components/JPage.vue'
import JList from '../components/JList.vue'
import JModal from '../components/JModal.vue'
import JButton from '../components/JButton.vue'
import { sortingTasks } from '@/helpers/sorting'
export default {
  name: 'ProjectDetailPage',
  data () {
    return {
      project: null,
      loading: true,
      tasks: null,
      showDeleteModal: false
    }
  },
  computed: {
    projectid () {
      return this.$route.params.id
    },
    tasksToDisplay () {
      return this.tasks.map(task => {
        let icon = ''
        let color = ''
        const buttons = [task.completed ? 'undone' : 'done', 'edit']
        if (task.completed) {
          icon = 'check',
          color = 'green'
        } else if (isPast(task.date)) {
          icon = 'warning',
          color = 'red'
        }
        return {
          id: task.id,
          header: task.task,
          subtitle: formatDate(task.date),
          icon: { icon, color },
          buttons,
          task: task.task,
          completed: task.completed,
          date: task.date
        }
      }).sort(sortingTasks)
    }
  },
  created () {
    const promises = [
      db.get('js4projects/' + this.projectid).then((record) => {
        this.project = record
      }),
      db.get('js4tasks?projectid=' + this.projectid).then((tasks) => {
        this.tasks = tasks
      })
    ]
    Promise.all(promises).then(() => {
      this.loading = false
    })
  },
  methods: {
    onItemButtonClicked (payload) {
      if (payload.button === 'edit') {
        this.$router.push('/taskform/' + payload.item.id)
      } else if (['done', 'undone'].indexOf(payload.button) >= 0) {
        const completed = payload.button === 'done' ? 1 : 0
        db.put('js4tasks', { id: payload.item.id, completed }).then(() => {
          db.get('js4tasks/' + payload.item.id).then((record) => {
            this.tasks.find(task => task.id === payload.item.id).completed = record.completed
          })
        })
      }
    },
    onEditButtonClicked () {
      this.$router.push('/projectform/' + this.project.id)
    },
    onAddTaskButtonClicked () {
      this.$router.push('/taskformproject/' + this.project.id)
    },
    onDeleteButtonClicked () {
      this.showDeleteModal = true
    },
    closeDeleteModal () {
      this.showDeleteModal = false
    },
    deleteProject () {
      db.delete('js4projects', { id: this.project.id }).then(() => {
        this.closeDeleteModal()
        this.$router.push('/projects')
      })
    }
  },
  components: { JPage, JList, JModal, JButton }
  /*
    db.get(js4tasks?id=8) // [{id: 8, task: posekat travu}]
    db.get(js4tasks/8) // {id: 8, task: posekat travu}
  */
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