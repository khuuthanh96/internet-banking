<template>
  <div id="adduser" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">Add User Page</h3>
      </div>
      <div class="panel-body">
        <h3 class="text-muted">New User</h3>
        <form class="form-horizontal text-right">
          <div class="form-group">
            <label for="txtUsername" class="col-sm-3">
              Username:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input type="text" v-model="username" class="form-control" id="txtUsername" placeholder="username" required>
            </div>
          </div>
          <div class="form-group">
            <label for="txtPassword" class="col-sm-3">
              Password:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input
                type="password"
                v-model="password"
                class="form-control"
                id="txtPassword"
                placeholder="password"
                required
              >
            </div>
          </div>
          <div class="form-group">
            <label for="txtRePassword" class="col-sm-3">
              Re-Password:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input
                type="password"
                v-model="repassword"
                class="form-control"
                id="txtRePassword"
                placeholder="re-password"
                required
              >
            </div>
          </div>
          <div class="form-group">
            <label for="txtName" class="col-sm-3">
              Name:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input type="text" v-model="name" class="form-control" id="txtName" placeholder="full name" required>
            </div>
          </div>
          <div class="form-group">
            <label for="txtEmail" class="col-sm-3">
              Email:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input type="email" v-model="email" class="form-control" id="txtEmail" placeholder="email" required>
            </div>
          </div>
          <div class="form-group">
            <label for="txtPhone" class="col-sm-3">
              Phone:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input type="text" v-model="phone" class="form-control" id="txtPhone" placeholder="phone number" required>
            </div>
          </div>
          <div class="form-group text-center">
            <button
              type="button"
              class="btn btn-success"
              :disabled="account.status.registering"
              @click="handleSubmit"
            >
              <span class="glyphicon glyphicon-plus"></span>
              Submit
            </button>
            &emsp;
            <img
              v-show="account.status.registering"
              src="/loading.gif"
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "adduser",
  data() {
    return {
      username: "",
      password: "",
      repassword: "",
      phone: "",
      email: "",
      name: ""
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  methods: {
    ...mapActions({
      success: "alert/success",
      error: "alert/error",
      clear: "alert/clear",
      register: "account/register"
    }),
    handleSubmit(e) {
      const self = this;
      //validate input data
      const { username, password, repassword, phone, email, name } = this;
      if (
        username === "" ||
        password === "" ||
        repassword === "" ||
        phone === "" ||
        email === "" ||
        name === ""
      ) {
        self.error("Has an required field was not filled in");

        setTimeout(() => {
          self.clear();
        }, 4000);
        return;
      }

      if (password !== repassword) {
        self.error("Password & Re-password not the same!");

        setTimeout(() => {
          self.clear();
        }, 4000);
        return;
      }

      //call api
      self.register({
          username,
          password,
          repassword,
          phone,
          email,
          name
        })
        .then(data => {
          if (data && data.success) {
            self.username = self.password = self.repassword = self.register = self.phone = self.email = self.name = "";
          }
        });
    }
  }
};
</script>

<style lang="css" scoped>
</style>