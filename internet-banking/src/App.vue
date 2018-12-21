<template>
  <div id="app">
    <Navbar/>
    <div class="container">      
      <div v-if="account.status.loggedIn" class="row">
        <div class="col-sm-3 col-md-3">
          <Categories/>
        </div>
        <div class="col-sm-9 col-md-9">
          <router-view/>
        </div>
      </div>
      <div v-else><router-view/></div>

      <div class="text-center" v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
    </div>

    <div class="footer">
        <p>  
          © 2018 Copyright - FIT HCMUS - CNM Final Project <br />
          MSSV: 1512510 - 1512501 - 1512540
        </p>
    </div>


  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Navbar from "./components/Navbar.vue";
import Categories from "./components/Categories.vue";
export default {
  name: "App",
  components: {
    Navbar,
    Categories
  },

  data() {
    return {};
  },
  computed: {
    ...mapState({
      alert: state => state.alert,
      account: state => state.account
    })
  },
  methods: {
    ...mapActions({
      clearAlert: "alert/clear"
    })
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.clearAlert();
    }
  }
};
</script>

<style>
.footer {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background-color:#f5f5f5;
  color: #999999;
  height: 60px;
  padding: 8px;
  text-align: center;
}

</style>
