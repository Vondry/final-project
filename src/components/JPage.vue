<template>
  <div>

    <h1>{{ title }}</h1>

    <img v-if="img" :src="getImgUrl(img)" :alt="title" />

    <div v-if="addButtonLabel" class="page-large-btn-container">
      <j-button :label="addButtonLabel" @clicked="$router.push(addButtonRedirect)" />
    </div>

    <j-loading v-if="loading" />

    <div v-else>
      <slot name="content"></slot>
      <div v-if="displayBackButton" class="back-button-container">
        <j-button label="back" @click="$router.back()"/>
      </div>
    </div>

  </div>
</template>

<script>
import JLoading from './JLoading.vue'
import JButton from './JButton.vue'
export default {
  name: 'JPage',
  props: {
    title: String,
    addButtonLabel: String,
    addButtonRedirect: String,
    img: String,
    loading: Boolean,
    displayBackButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getImgUrl (pic) {
      return require('../assets/img/' + pic)
    }
  },
  components: { JLoading, JButton }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
h1
  font-size: $title-size
  margin: $margin 0
img
  margin-bottom: $margin
.page-large-btn-container
  padding-bottom: $margin
</style>