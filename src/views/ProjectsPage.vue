<template>
  <j-page
    title="projects"
    addButtonLabel="add project"
    addButtonRedirect="/projectform"
    :loading="loading"
    img="projects.png"
  >
    <template v-slot:content>
      
      <p v-if="!projects.length">there are no projects in the database yet</p>
        <template v-else>
          <j-accordeon v-for="project in projectsToDisplay" :key="project.id"
            :title="project.project + ' (' + project.tasks.filter(task => task.completed).length + '/' + project.tasks.length + ')'">
            <template v-slot:content>
              <div class="page-btn-container">
                <j-button label="detail" small-size @clicked="$router.push('/project/' + project.id)" />
                <j-button label="edit" small-size @clicked="$router.push('/projectform/' + project.id)" />
                <j-button v-if="!project.tasks.length" label="delete" small-size @clicked="onDeleteClicked(project)" />
                <j-button label="add task" small-size @clicked="$router.push('/taskformproject/' + project.id)" />
              </div>
              <p v-if="!project.tasks.length" class="no-data-message">there are no tasks in the project</p>
              <j-list :items="project.tasks" display-icons />
            </template>
          </j-accordeon>
        </template>

    </template>
  </j-page>
  <j-modal
    :show="showDeleteModal"
    title="confirm delete"
    ok-button-label="delete"
    cancel-button-label="cancel"
    @close-me="closeDeleteModal"
    @ok-clicked="deleteProject"
    @cancel-clicked="closeDeleteModal"
  >
    <div>
      <span>Do you really want to delete project </span>
      <strong>{{ projectToDelete.project }}</strong>
      <span> ?</span>
    </div>
  </j-modal>
</template>

<script>
import db from '../helpers/db.js'
import { formatDate, isPast } from '../helpers/dateFunction'
import JAccordeon from '../components/JAccordeon.vue';
import JList from '../components/JList.vue'
import JButton from '../components/JButton.vue'
import JModal from '../components/JModal.vue'
import JPage from '../components/JPage.vue'
import { sortingTasks } from '@/helpers/sorting';

export default {
  name: 'ProjectsPage',
  data () {
    return {
      projects: [],
      tasks: [],
      loading: true,
      showDeleteModal: false,
      projectToDelete: {}
    }
  },
  computed: {
    projectsToDisplay () { // [ {id: 1, project: 'zahrada', tasks: [{task1 ....}]}]
      return this.projects.map(project => {
        return Object.assign(
          {
            tasks: this.tasks.filter(task => project.id === task.projectid).map(item => {
              let icon = ''
              if (item.completed) {
                icon = { icon: 'check', color: 'green' }
              } else if (isPast(item.date)) {
                icon = { icon: 'warning', color: 'red' }
              }
              return {
                id: item.id,
                header: item.task,
                subtitle: formatDate(item.date),
                icon,
                completed: item.completed,
                task: item.task,
                date: item.date
              }
            }).sort(sortingTasks)
          },
          project
        )
      }).sort((a, b) => a.project.localeCompare(b.project))
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    onDeleteClicked (project) { // { project: 'zahrada', id: 1, tasks: [] }
      this.projectToDelete = project
      this.showDeleteModal = true
    },
    deleteProject () {
      db.delete('js4projects', { id: this.projectToDelete.id }).then(() => {
        this.projectToDelete = {}
        this.showDeleteModal = false
        this.fetchData()
      })
    },
    closeDeleteModal () {
      this.projectToDelete = {}
      this.showDeleteModal = false
    },
    fetchData () {
      const promises = [
        db.get('js4projects').then(projects => {
          this.projects = projects
        }),
        db.get('js4tasks').then(tasks => {
          this.tasks = tasks
        })
      ]
      Promise.all(promises).then(() => {
        this.loading = false
      })
    }
  },
  components: { JAccordeon, JList, JButton, JPage, JModal }
}
</script>
<style lang="stylus" scoped>
</style>