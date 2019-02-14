<template>
  <div id="statistics">
    <!-- <h1>dsadsadsad</h1> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
// import homeChild1 from './home-child1'
// import homeChild2 from './home-child2'
// import homeChild3 from './home-child3'
// const exchangData = () =>
//     import(/* webpackChunkName:"exchangData" */ "./exchangData");
// const exchangDataDetail = () =>
//     import(/* webpackChunkName:"exchangDataDetail" */ "./exchangDataDetail");

export default {
  name: "statistics",

  components: {
    // exchangData,
    // exchangDataDetail
  },
  data() {
    return {};
  },
  created() {},

  mounted() {
    // window.scrollTo(0, 0);
    //  console.log(this.stepModel.step)
  },
  methods: {}
};
</script>

<style scoped>
</style>
