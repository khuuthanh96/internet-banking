<template>
  <nav class="navbar navbar-primary" role="navigation">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <router-link to="/" class="navbar-brand">
          <span class="glyphicon glyphicon-home"></span>
          <span>&emsp;Internet Banking</span>
          <span v-if="account.status.loggedIn && account.user.roles === 'admin'">&ensp;<b class="text-danger"><i>Admin</i></b></span>
        </router-link>
      </div>
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse navbar-ex1-collapse">
        <ul class="nav navbar-nav navbar-right">
          <li v-if="!account.status.loggedIn">
            <router-link to="/login">
              <span class="glyphicon glyphicon-user"></span>
              Login
            </router-link>
          </li>
          <li v-if="account.status.loggedIn">
            <router-link to="/profile" class="btn btn-link">
              <span class="glyphicon glyphicon-user"></span>
              &emsp;<b class="username">{{account.user.name}}</b>
            </router-link>
          </li>
          <li v-if="account.status.loggedIn" class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
              <li style="margin-bottom:5px; border-bottom: 1px solid #eee;">
                <router-link to="/profile" class="btn btn-link">
                  Profile&emsp;
                  <span class="glyphicon glyphicon-edit"></span>
                </router-link>
              </li>
              <li>
                <router-link to="/login" class="btn btn-link">
                  Logout&emsp;
                  <span class="glyphicon glyphicon-log-out"></span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  }
};
</script>

<style lang="css" scoped>
.username {
  font-size: 17px;
}
</style>