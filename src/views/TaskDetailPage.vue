<template>
  <j-page
    :loading="loading"
    :title="task ? task.task : ''"
  >
    <template v-slot:content>
      <div class="top-buttons">
        <j-button label="edit" @clicked="onEditButtonClicked"/>
        <j-button v-if="!persons.length" label="delete" @clicked="onDeleteButtonClicked" />
        <j-button label="add person" @clicked="onAddPersonClicked" />
      </div>
      <div>
        <j-list
          :items="personsToDisplay"
          @clicked="onItemButtonClicked"
        />
      </div>
    </template>
  </j-page>
  <j-modal
    :show="showDeleteModal"
    title="confirm task delete"
    ok-button-label="delete"
    @close-me="closeDeleteModal"
    @ok-clicked="deleteTask"
    @cancel-clicked="closeDeleteModal"
  >
  <div>
    <span>do you really want to delete this task </span>
    <strong>{{ person.last + ' ' + person.first }}</strong>
    <span> ?</span>
  </div>
  </j-modal>
  <j-modal
    :show="showAddPersonModal"
    title="add person"
    ok-button-label="submit"
    @close-me="closeAddPersonModal"
    @cancel-clicked="closeAddPersonModal"
    @ok-clicked="addPerson"
  >
    <div>
      <j-input
        control="addPerson"
        :settings="addPersonSettings"
        @changed="onAddPersonChanged"
      />
    </div>
  </j-modal>
</template>

<script>
import db from '@/helpers/db';
import JPage from '../components/JPage.vue'
import JButton from '@/components/JButton.vue';
import JModal from '@/components/JModal.vue';
import JList from '@/components/JList.vue';
import JInput from '@/components/form/JInput.vue';


export default {
  name: 'TaskDetailPage',
  data () {
    return {
      task: null, // Object
      persons: null, // Array
      loading: true,
      showDeleteModal: false,
      showAddPersonModal: false,
      addPersonSettings: {
        type: 'select',
        options: [
  //        { value: ..., label: ...}
        ]
      },
      personToAdd: null
    }
  },
  computed: {
    taskid () {
      return this.$route.params.id
    },
    personsToDisplay () {
      return this.persons.map(person => {
        return {
          id: person.personid,
          header: person.last + ' ' + person.first,
          subtitle: person.position,
          icon: { icon: '', color: ''},
          buttons: ['remove', 'edit']
        }
      }).sort((a, b) => a.header.localeCompare(b.header))
    }
  },
  created () {
    Promise.all([
      db.get('js4tasks/' + this.taskid).then(task => {
        this.task = task
      }),
      this.fetchPersons()
    ]).then(() => {
      this.loading = false
    })
  },
  methods: {
    fetchPersons () {
      return db.get('js4personstasks?taskid=' + this.taskid).then(persons => {
        this.persons = persons
      })
      /*
        [
          { id: 1, taskid: 2, personid: 5, task: 'natřít plot', first: 'Karel', last: 'Houska', ...},
          { id: 2, taskid: 2, personid: 3}
        ]
      */
    },
    onEditButtonClicked () {
      this.$router.push('/taskform/' + this.taskid)
    },
    onDeleteButtonClicked () {
      this.showDeleteModal = true
    },
    closeDeleteModal () {
      this.showDeleteModal = false
    },
    deleteTask () {
      db.delete('js4tasks', { id: this.taskid }).then(() => {
        this.closeDeleteModal()
        this.$router.push('/tasks')
      })
    },
    onItemButtonClicked (payload) {
      if (payload.button === 'edit') {
        this.$router.push('/personform/' + payload.item.id)
        return
      }
      if (payload.button === 'remove') {
        const obj = this.persons.find((item) => {
          return ('' + item.taskid === '' + this.taskid) && ('' + item.personid === '' + payload.item.id)
        })
        db.delete('js4personstasks', { id: obj.id }).then(() => {
          this.fetchPersons()
        })
      }
    },
    onAddPersonClicked () {
      // načíst z databáze všechny persons
      // vyfiltrovat to načtené pole na persons, které ještě nejsou našemu úkolu přiřazeny
      // namapovat vyfiltrované pole na formát { value: personid, label: popisek = last + first + (position) }
      // this.persons = [ {personid: 'jablko', last: '', first: '' }, §hruška, 'švestka']
      db.get('js4persons').then((allPersons) => {
        // porovnávat budeme podle personid
        // první na porovnání - načtená tabulka persons .... a tam mám hodnotu person.id
        // druhá na porovnávání - this.fetch persons ==== načetly se záznamy z db => již přiřazené osoby se vyvolají persons.filter (person =>  return person.id  )
        const personsFiltered = allPersons.filter(personFromAll => {
          return !this.persons.some(item => {
            return '' + item.personid === '' + personFromAll.id
          })
        // ANEBO tento kod
        // const assignedPersonsId = this.persons.map(person => person.personid)
        // const perosnFiltered = allPersons.filter(personFromAll => assignedPersonsId.indexOf(personFromAll.id) < 0)
        })
        this.addPersonSettings.options = personsFiltered.map(person => {
          return {
            value: person.id,
            label: person.last + ' ' + person.first + ' (' + person.position + ')'
          }
        })
        this.addPersonSettings.options.unshift({ value: '', label: '' })
      }).then(() => {
        this.personToAdd = null
        this.showAddPersonModal = true
      })
    },
    closeAddPersonModal () {
      this.showAddPersonModal = false
    },
    addPerson () {
      db.post('js4personstasks', { taskid: this.taskid, personid: this.personToAdd }).then(() => {
        this.fetchPersons().then(() => {
          this.closeAddPersonModal()
        })
      })
    },
    onAddPersonChanged (payload) {
      this.personToAdd = payload.value
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