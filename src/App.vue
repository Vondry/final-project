<template>
  <j-nav-bar :links="navbarLinks" />
  <error-page v-if="error" />
  <router-view v-else/>
</template>

<script>
import JNavBar from './components/JNavBar.vue';
import ErrorPage from './views/ErrorPage.vue';

export default {
  name: 'App',
  data () {
    return {
      navbarLinks: [
      { path: '/', label: 'Home'},
      { path: '/projects', label: 'Projects'},
      { path: '/tasks', label: 'Tasks'},
      { path: '/people', label: 'People'},
      ]
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    }
  },
  mounted () {
    window.addEventListener('error', () => {
      this.$store.commit('setErrorMessage', 'jejda, něco se pokazilo')
      this.$store.commit('setError', true)
    })
  },
  components: { JNavBar, ErrorPage },
}

</script>

<style lang="stylus">
body, html
  margin: 0
  padding: 0
body
  padding-bottom: 2rem

#app
  font-family Avenir, Helvetica, Arial, sans-serif
  text-align center
  color #2c3e50

.page-btn-container
  display: flex
  justify-content: flex-end
  align-items: center
  padding: $list-items-padding
  border-bottom: 1px solid #efefef
  gap: $flex-gap

.back-button-container
  margin: $margin 0
  margin-top: 1rem

.no-data-message
  padding-bottom: 1rem

</style>
