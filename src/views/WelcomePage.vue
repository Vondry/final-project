<template>
  <j-page
  title="welcome to my final project :)"
  :loading="loading"
  >
  <template v-slot:content>
    <div>
      <ul>
        <li>
          <span>statistics</span>
        </li>
        <li>
          <span>projects:</span>
          <strong>{{ NumberOfProjects }}</strong>
        </li>
        <li>
          <span># of tasks:</span>
          <strong>{{ NumberOfTasks }}</strong>
        </li>
        <li>
          <span>completed:</span>
          <strong>{{ NumberOfCompleted }}</strong>
        </li>
        <li>
          <span>incomplete:</span>
          <strong>{{ NumberOfIncomplete }}</strong>
        </li>
        <li>
          <span>overdue:</span>
          <strong>{{ NumberOfOverdue }}</strong>
        </li>
        <li>
          <span>number of people:</span>
          <strong>{{ NumberOfPeople }}</strong>
        </li>
      </ul>
    </div>
  </template> 
  </j-page>

</template>

<script>
import JPage from '@/components/JPage.vue'
import db from '@/helpers/db.js'
import { isPast } from '../helpers/dateFunction'


export default {
  name: 'WelcomePage',
  data () {
    return {
      projects: [],
      tasks: [],
      persons: [],
      loading: true
    }
  },
  computed: {
    NumberOfProjects () {
      return this.projects.length
    },
    NumberOfTasks () {
      return this.tasks.length
    },
    NumberOfPeople () {
      return this.persons.length
    },
    NumberOfCompleted () {
      return this.tasks.filter(task => task.completed).length
    },
    NumberOfIncomplete () {
      return this.tasks.filter(task => !task.completed).length
    },
    NumberOfOverdue () {
      return this.tasks.filter(task => !task.completed && isPast(task.date)).length
    },
  },
  created () {
    const promises =  [
      db.get('js4projects').then((projects) => {
        this.projects = projects
      }),
      db.get('js4tasks').then((tasks) => {
        this.tasks = tasks
      }),
      db.get('js4persons').then((persons) => {
        this.persons = persons
      }),
    ]
    Promise.all(promises).then(() => {
      this.loading = false
    })
  },
  components: { JPage }
}


</script>


<style lang="stylus" scoped>
@import '../styles/variables.styl'

ul
  list-style-type: none
  padding: 0
  margin: auto
  width: 80%
  max-width: 400px
  border: 2px solid #cdcdcd
  border-radius: $border-radius
  overflow: hidden
  & li
    padding: .4em .8em
    &:not(:last-child)
      border-bottom: 1px solid #efefef
    &:first-child
      font-weight: bold
      background: lighten($secondary, 60%)
    &:not(:first-child)
      display: flex
      justify-content: space-between


</style>