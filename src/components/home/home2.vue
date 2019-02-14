<template>
  <div id="home2">
    <router-link to="/organization">
      <p style="text-align: center;">我是2</p>
    </router-link>
  </div>
</template>

<script>
import { httpServer, apiSetting } from "../../assets/js/http.js";

export default {
  name: "home2",
  components: {},
  data() {
    return {};
  },
  mounted() {
    //  httpServer(apiSetting.getMenus)
    //         .then(response => {
    //             console.log(response)
    //         })
    //         .catch(error => {
    //             // alert(error)
    //           console.log(error) //loading层关闭
    //         });
  },
  methods: {}
};
</script>

<style scoped>
</style>
