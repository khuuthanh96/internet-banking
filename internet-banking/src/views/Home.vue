<template>
  <div class="home">
    <h1>This is home</h1>
    <button type="button" class="btn btn-primary" @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "home",
  components: {},
  computed: {
    ...mapState("account", ["status"])
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
