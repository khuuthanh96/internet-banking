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
          <div class="temp"></div>
        </div>
      </div>
      <div v-else><router-view/></div>

      <div class="text-center" v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
      <div class="temp-login"></div>
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
.temp-login
{
  height: calc(100vh - 596px);
}
.row + .temp-login
{
  display: none;
}
#accounts + .temp
{
  height: calc(100vh - 330px);
}
#transfer + .temp
{
  /* height: 70px; */
  height: calc(100vh - 704px);
}
#receiver + .temp
{
  /* height: 313px; */
  height: calc(100vh - 382px);
}
#transactions + .temp
{
  /* height: 365px; */
  height: calc(100vh - 330px);
}
#recharge + .temp
{
  height: calc(100vh - 567px);
}
#adduser + .temp
{
  height: calc(100vh - 627px);
}
#addaccount + .temp
{
  height: calc(100vh - 518.5px);
}
.home + .temp
{
  height: calc(100vh - 217px);
}
.admin + .temp
{
  height: calc(100vh - 217px);
}
@media only screen and (max-width: 767px) 
{
  #accounts + .temp
  {
    height: calc(100vh - 95vh);
  }
  #transfer + .temp
  {
    height: 0px;
  }
  #receiver + .temp
  {
    height: calc(100vh - 738px);
  }
  #transactions + .temp
  {
    height: calc(100vh - 575px);
  }
  .home + .temp
  {
    height: calc(100vh - 438px);
  }
  .admin + .temp
  {
    height: calc(100vh - 438px);
  }
}
@media only screen and (max-width: 991px) 
{
  #recharge + .temp
  {
    height: calc(100vh - 589px);
  }
  #addaccount + .temp
  {
    height: calc(100vh - 529.5px);
  }
}
@media only screen and (max-width: 767px) 
{
  #recharge + .temp
  {
    height: 0px;
  }
  #adduser + .temp
  {
    height: 0px;
  }
  #addaccount + .temp
  {
    height: 0px;
  }
}
@media only screen and (max-height: 710px) 
{
  #transfer + .temp
  {
    height: 0px;
  }
}
@media only screen and (min-height: 665px) 
{
  .temp-login
  {
    height: calc(100vh - 666px);
  }
}
@media only screen and (min-width: 767px) 
{
  .temp-login
  {
    height: calc(100vh - 596px);
  }
}
.footer 
{
  width: 100%;
  background-color:#f5f5f5;
  color: #999999;
  height: 60px;
  padding: 8px;
  text-align: center;
}

</style>
