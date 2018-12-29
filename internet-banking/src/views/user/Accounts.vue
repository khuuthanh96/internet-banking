<template>
  <div id="accounts" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">My Accounts</h3>
      </div>
      <div class="panel-body">
        <!-- <div class="row"> -->
        <h3 class="text-muted page-title">Accounts List</h3>
        <!-- <span class="text-center col-sm-2" style="margin-top: 20px;
    margin-bottom: 10px;">
          <button
            type="button"
            class="btn btn-info"
            @click="handleSubmit"
            :disabled="account.status.adding"
          >
            <span class="glyphicon glyphicon-refresh"></span>
            Reload
          </button>
          <img v-show="account.status.adding" src="/loading.gif">
        </span> -->
        <!-- </div> -->
        

        <AccountBox
        v-for="a in listAccount"
        :key="a.number"
        :number="a.number"
        :balance="a.balance"
        :option="optClicked"
        v-on:delID="handlerDelClick"
        ></AccountBox>
  
        <button 
          class="btn btn-default edit-btn"
          @click="handleOption"
        >
          <span class="glyphicon glyphicon-cog edit-btn"></span>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div id="myModel" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title text-danger">Close Account</h4>
          </div>
          <div class="modal-body">
            <p v-if="listAccount.length < 2">Must have at least 1 account</p>
            <p v-else-if="accSelected.balance > 0">This account <b class="text-warning">has balance</b>! Please choose another account to transfer before <b class="text-danger">close</b>.</p>
            <p v-else>Are you sure!</p>        
          </div>
          <div class="modal-footer">
            <button 
              v-if="listAccount.length > 2 && accSelected.balance === 0" 
              type="button" class="btn btn-danger" data-dismiss="modal"
              @click="handleDelAcc">OK</button>                    
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
            
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AccountBox from "../../components/AccountBox.vue"

export default {
  name: "accounts",
  data() {
    return {
      listAccount: [],
      optClicked: false,
      accSelected: -1
    };
  },
  components: {
    AccountBox
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
      getUserAccounts: "account/getUserAccounts",
      closingUserAccount: "account/closeAccount"
    }),
    handleOption() {
      this.optClicked = !this.optClicked
    },
    handlerDelClick(accNumberSelected) {
      this.accSelected = this.listAccount.find(a => a.number === accNumberSelected)
    },
    handleDelAcc() {
      const self = this;
      self.closingUserAccount(self.accSelected._id)
      .then(data => {
        if(data && data.success) {
          var index = self.listAccount.indexOf(self.accSelected);
          if (index > -1) {
            self.listAccount.splice(index, 1);
          }
        }
      });
    }
  }
};
</script>

<style lang="css">
.page-title {
  margin-top: 5px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.edit-btn {
  float: right;
  vertical-align: none;
  font-size: 20px;
  display: block;
}

.remove-btn {
  margin-bottom: 20px;
}
</style>