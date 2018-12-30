<template>
  <div id="transactions" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">History Transaction</h3>
      </div>
      <div class="panel-body">
        <!-- <div class="row"> -->
        <h3 class="text-muted page-title">Account's History Transaction</h3>


      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "transaction",
  data() {
    return {
      listAccount: [],
      optClicked: false,
      accSelected: -1
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
    const self = this;
    self.getUserAccounts(self.account.user._id)
    .then(data => {
      if(data && data.success) {
        self.listAccount = data.accounts;
      };
    })
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