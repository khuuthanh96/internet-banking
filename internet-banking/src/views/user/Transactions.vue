<template>
  <div id="transactions" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">History Transaction</h3>
      </div>
      <div class="panel-body">
        <!-- <div class="row"> -->
        <h3 class="text-muted page-title">Account's History Transaction</h3>

        <div class="form-group row">
          <label for="selectAcc" class="col-sm-3">
            Your account number:
            <span class="text-danger">(*)</span>
          </label>
          <div class="col-sm-8">
            <select id="selectAcc" class="form-control" v-model="selectedAccount">
              <option
                :selected="selectedAccount === 'Choose account'"
                value="Choose account"
              >Choose account</option>
              <option
                v-for="a in listAccount"
                :key="a._id"
                :selected="a.number === selectedAccount"
                :value="a._id"
              >{{a.number}}</option>
            </select>
          </div>
        </div>

        <TransactionBox
          v-for="t in transSelectedAcc"
          :key="t._id"
          :numberSrc="t.accountSrcNumber"
          :numberDes="t.accountDesNumber"
          :total="t.total"
          :date="t.create_at"
          :selectedNumber="getAccNumber"
        ></TransactionBox>
      </div>
        

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TransactionBox from "../../components/TransactionBox.vue"

export default {
  name: "transaction",
  data() {
    return {
      listAccount: [],
      selectedAccount: "Choose account",
      transSelectedAcc: false
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    }),
    getAccNumber() {
      const self = this;
      if(self.selectedAccount === "Choose account") return 0;
      const acc = self.listAccount.find(a => a._id === self.selectedAccount)
      return acc.number;
    }
  },
  components: {
    TransactionBox
  },
  watch: {
    selectedAccount: function() {
      const self=this;
       if(self.selectedAccount !== "Choose account") {
        self.getAllAccountHistoryTrans(self.selectedAccount)
        .then(data => {
          if(data && data.success) {
            self.transSelectedAcc = data.trans;
            console.log(data.trans)
          }
        })
      }
    }
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
      getUserAccounts: "account/getUserAccounts",
      getAllAccountHistoryTrans: "account/getAllAccountHistoryTrans"
    })
  }
};
</script>

<style lang="css">
</style>