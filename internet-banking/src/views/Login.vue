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
          <form @submit.prevent="handleSubmit" action="javascript:alert(grecaptcha.getResponse(widgetId1));" class="form-horizontal text-right">
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
                src="/loading.gif"
              >
            </div>
            <div class="form-group" style="margin-left: 35px;">
                <VueRecaptcha
                  ref="recaptcha"
                  @verify="onCaptchaVerified"
                  @expired="onCaptchaExpired"
                  sitekey="6LfM-4MUAAAAAOHX7VEw7MxE021Pmi4V1Ma7DPim">
                </VueRecaptcha>
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
import VueRecaptcha from "vue-recaptcha"

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
      recaptchaToken: ""
    };
  },
  computed: {
    ...mapState("account", ["status"])
  },
  components: {
    VueRecaptcha
  },
  created() {
    // reset login status
    this.logout();
  },
  methods: {
    ...mapActions("account", ["login", "logout"]),
    handleSubmit(e) {
      this.submitted = true;
      const { username, password, recaptchaToken } = this;
      if (username && password) {
        self.grecaptcha.reset();
        this.login({ username, password, recaptchaToken });
      }
    },
    onCaptchaVerified: function (recaptchaToken) {
      const self = this;
      self.recaptchaToken = recaptchaToken;
    },
    onCaptchaExpired: function () {
      self.grecaptcha.reset();
    }
  }
};
</script>

<style lang="css" scoped>
</style>
