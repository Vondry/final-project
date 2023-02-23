<template>
  <j-page
    title="persons"
    addButtonLabel="add person"
    addButtonRedirect="/personform"
    img="persons.png"
    :loading="loading"
  >
    <template v-slot:content>

      <p v-if="!persons.length">there are no poeple in the database, yet</p>
        <j-accordeon
          v-for="person in personsToDisplay"
          :key="person.id"
          :title="person.fullName + ' (' + person.position + ')'"
        >
          <template v-slot:content>
            <div class="page-btn-container tasks-btn-container">
              <j-button label="detail" small-size @clicked="$router.push('/person/' + person.id)" />
              <j-button label="edit" small-size @clicked="$router.push('/personform/' + person.id)" />
              <j-button v-if="!person.tasks.length" label="delete" small-size @clicked="onDeleteClicked(person)" />
            </div>
            <p v-if="!person.tasks.length" class="no-data-message">this person has no tasks, yet</p>
            <j-list :items="person.tasks" display-icons />
          </template>
        </j-accordeon>
    </template>
  </j-page>
  <j-modal
    :show="showDeleteModal"
    title="confirm delete"
    ok-button-label="delete"
    cancel-button-label="cancel"
    @close-me="closeDeleteModal"
    @ok-clicked="deletePerson"
    @cancel-clicked="closeDeleteModal">
    <div>
      <span>Do you really want to delete </span>
      <strong>{{ personToDelete.fullName }}</strong>
      <span> ?</span>
    </div>
  </j-modal>
</template>

<script>
import db from '../helpers/db.js'
import { formatDate, isPast } from '../helpers/dateFunction.js'
import { sortingTasks } from '@/helpers/sorting.js'
import JButton from '../components/JButton.vue'
import JAccordeon from '../components/JAccordeon.vue'
import JList from '../components/JList.vue'
import JPage from '../components/JPage.vue'
import JModal from '../components/JModal.vue'

export default {
  name: 'PeoplePage',
  data () {
    return {
      loading: true,
      persons: [],
      tasks: [],
      personToDelete: {},
      showDeleteModal: false
    }
  },
  computed: {
    personsToDisplay () {
      return this.persons.map(person => {
        return {
          id: person.id,
          fullName: person.last + ' ' + person.first,
          position: person.position,
          tasks: this.tasks.filter(task => person.id === task.personid).map(task => {
            let icon = ''
            let color = ''
            if(task.completed) {
              icon = 'check'
              color = 'green'
            }
            else if (isPast(task.date)) {
              icon = 'warning'
              color = 'red'
            }
            return {
              id: task.id,
              header: task.task,
              subtitle: task.project + ', ' + formatDate(task.date),
              icon: { icon, color },
              task: task.task,
              completed: task.completed,
              date: task.date
            }
          }).sort(sortingTasks)
        }
      }).sort((a, b) => a.fullName.localeCompare(b.fullName))
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Promise.all([
        db.get('js4persons').then((persons) => { this.persons = persons }),
        db.get('js4personstasks').then(tasks => { this.tasks = tasks })
      ]).then(() => {
        this.loading = false
      })
    },
    onDeleteClicked (person) {
      this.personToDelete = person
      this.showDeleteModal = true
      console.log(this.personToDelete)
    },
    closeDeleteModal () {
      this.personToDelete = {}
      this.showDeleteModal = false
    },
    deletePerson () {
      db.delete('js4persons', { id: this.personToDelete.id } ).then(() => {
        this.closeDeleteModal()
        this.fetchData()
      })
    },
    // errorBtn () {
    //   const obj = null
    //   console.log(obj.property)
    // }
  },
  components: { JButton, JList, JAccordeon, JPage, JModal }
}
</script>