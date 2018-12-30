<template>
  <div id="receiver" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">Setting</h3>
      </div>
      <div class="panel-body">
        <!-- <div class="row"> -->
        <h3 class="text-muted page-title">Favourite Receiver</h3>


      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "receiver",
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
   
  },
  methods: {
    ...mapActions({
      success: "alert/success",
      error: "alert/error",
      clear: "alert/clear",
      getUserAccounts: "account/getUserAccounts"
    })
  }
};
</script>

<style lang="css">
</style>