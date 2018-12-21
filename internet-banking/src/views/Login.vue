<template>
  <div class="text-center" id="Login">
    <div class="page-header" style="margin-top: 0px; border-bottom: 0px;">
      <img src="/ebanking.png" alt="logo">
    </div>
    <h3 style="margin-bottom: 20px;">Login</h3>
    <div class="row center-block">
      <div class="col-sm-4 col-md-4"></div>
      <div class="col-sm-4 col-md-4">
        <div class="row">
          <form @submit.prevent="handleSubmit" class="form-horizontal text-right">
            <div class="form-group">
              <label for="txtUsername" class="col-sm-3">Username:</label>
              <div class="col-sm-8">
                <input type="text" v-model="username" class="form-control" id="txtUsername">
              </div>
            </div>
            <div class="form-group">
              <label for="txtPassword" class="col-sm-3">Password:</label>
              <div class="col-sm-8">
                <input type="password" v-model="password" class="form-control" id="txtPassword">
              </div>
            </div>
            <div class="form-group text-center">
              <button
                type="button"
                class="btn btn-success"
                :disabled="status.loggingIn"
                @click="handleSubmit"
              >
                <span class="glyphicon glyphicon-user"></span>
                Login
              </button>
              <img
                v-show="status.loggingIn"
                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
              >
            </div>
          </form>
        </div>
      </div>
      <div class="col-sm-4 col-md-4"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      submitted: false
    };
  },
  computed: {
    ...mapState("account", ["status"])
  },
  created() {
    // reset login status
    this.logout();
  },
  methods: {
    ...mapActions("account", ["login", "logout"]),
    handleSubmit(e) {
      this.submitted = true;
      const { username, password } = this;
      if (username && password) {
        this.login({ username, password });
      }
    }
  }
};
</script>

<style lang="css" scoped>
</style>
