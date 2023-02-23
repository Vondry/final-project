<template>
  <button class="hamburger" @click="onHamburgerClicked">
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
</template>


<script>
export default {
  name: 'JHamburger',
  methods: {
    onHamburgerClicked () {
      this.$emit('clicked')
    }
  }
}

</script>

<style lang="stylus" scoped> 
@import '../styles/variables.styl'

.hamburger
  display: flex
  flex-direction: column
  justify-content: space-around
  cursor: pointer
  background: none
  border: 2px solid white
  width: 36px
  height: 36px

.hamburger, .bar
  transition: border-color .3s ease

.hamburger:hover
  border: 2px solid $tertiary

  & .bar
    background-color: $tertiary
  
.bar
  display: block
  width: 100%
  height: 4px
  background-color: white
  margin: 2px 4px  




</style>