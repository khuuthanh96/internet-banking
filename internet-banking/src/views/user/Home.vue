<template>
  <div class="home text-center">
    <h1 style="margin-top:0px;">Home Page</h1>
    <p>Welcome
      <b>{{account.user.name}}</b>
    </p>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "home",
  components: {},
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  methods: {
    ...mapActions("account", ["logout"]),
    handleLogout(e) {
      this.logout();
      location.reload(true);
    }
  }
};
</script>
