<template>
  <j-page
    title="error"
    :loading="false"
  >
    <template v-slot:content>
      <p> {{ errorMessage }}</p>

      <div class="back-button-container">
        <j-button label="home" @clicked="onBtnClicked" />
      </div>
    </template>

  </j-page>  
</template>


<script>

import JPage from '@/components/JPage.vue';
import JButton from '@/components/JButton.vue';

export default {
  name: 'ErrorPage',
  computed: {
    errorMessage () {
      return this.$store.state.errorMessage
    }
  },
  methods: {
    onBtnClicked () {
      this.$store.commit('setError', false)
      this.$router.push('/')
    }
  },
  components: { JButton, JPage }
}

</script>