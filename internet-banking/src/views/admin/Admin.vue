<template>
  <div class="admin text-center">
    <h1 style="margin-top:0px;">Admin Page</h1>
    <p>Welcome Admin
      <b>{{account.user.name}}</b>
    </p>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "admin",
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
