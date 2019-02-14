<template>
  <div id="app">
    
    <!-- <left-menu></left-menu>
      <div class="content_main" id="content_main">
           <div class="content">
              <personal></personal>
               <router-view/>
           </div>
      </div> -->
   <router-view name='home'></router-view>
   <router-view/>
  </div>
</template>

<script>
// import leftMenu from './components/nav-left.vue'
// import personal from './components/personal.vue'



export default {
  name: 'App',
  data(){
    return{
      logo: require('./assets/logo.png')
    }
  }
}
</script>

<style scoped>

</style>
