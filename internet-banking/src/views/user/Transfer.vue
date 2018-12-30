<template>
  <div id="transfer" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">Transfer money</h3>
      </div>
      <div class="panel-body">
        <!-- <div class="row"> -->
        <h3 class="text-muted page-title">Input Infomation</h3>

        <!-- Modal -->
        <div id="myModel" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title text-info">Transaction Verify</h4>
              </div>
              <div class="modal-body">
                <h3 class="text-warning">Input your OTP Code:</h3> 
                <input class="text-center" type="text" v-model="optCode">
                <p>OTP code has send to your email address. Please check your email!</p>
                <p class="text-danger" v-show="error">{{error}}</p>
              </div>
              <div class="modal-footer">
                <button 
                  type="button" class="btn btn-success"
                  @click="handleTransfer">Submit</button>                    
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
                
            </div>
          </div>
        </div>

        <form class="form-horizontal text-right">
          <div class="form-group">
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

          <div class="form-group">
            <label for="numMoney" class="col-sm-3">
              Total Money:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input
                type="number"
                v-model="inputMoney"
                class="form-control"
                id="numMoney"
                placeholder="100.000 VNĐ"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="txtDescription" class="col-sm-3">
              Description:
            </label>
            <div class="col-sm-8">
              <input
                type="text"
                v-model="description"
                class="form-control"
                id="txtDescription"
                placeholder="note"
              >
            </div>
          </div>

          <div class="form-group text-center">
            <input type="radio" id="one" value="true" v-model="feeCharger" checked>&ensp;
            <label for="one">Your charge fee</label>
            &ensp;
            <input type="radio" id="two" value="false" v-model="feeCharger">&ensp;
            <label for="two">Receiver charge fee</label>
          </div>

          <div
            class="glyphicon glyphicon-share-alt text-center"
            style="display: block; font-size: 30px; margin-bottom: 15px;"
          ></div>
          <div class="form-group">
            <label for="receiver" class="col-sm-3">
              Account Receive:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input
                type="string"
                v-model="inputAccount"
                class="form-control"
                id="receiver"
                required
                placeholder="input account number"
              >
              <button type="button" class="btn btn-default" @click="handleSearch">
                <span class="glyphicon glyphicon-search" style="font-size:15px;"></span>
              </button>
            </div>
          </div>

          <div class="form-group col-sm-6">
            <label for="txtName" class="col-sm-3">Name:</label>
            <div class="col-sm-8">
              <input
                type="text"
                class="plaintext"
                id="txtName"
                :value="accountInfo.owner"
                placeholder="Account name"
                readonly
              >
            </div>
          </div>

          <div class="form-group  col-sm-6">
            <label for="txtEmail" class="col-sm-3">Email:</label>
            <div class="col-sm-8">
              <input
                type="text"
                class="plaintext"
                id="txtEmail"
                :value="accountInfo.email"
                placeholder="Account email"
                readonly
              >
            </div>
          </div>

          <div class="form-group  col-sm-6">
            <label for="txtPhone" class="col-sm-3">Phone:</label>
            <div class="col-sm-8">
              <input
                type="text"
                class="plaintext"
                id="txtPhone"
                :value="accountInfo.phone"
                placeholder="Account phone"
                readonly
              >
            </div>
          </div>
          <div class="form-group text-center col-sm-12">
            <button
              type="button"
              class="btn btn-success"
              @click="handleSubmit"
    
              :disabled="account.status.adding"
            >
              <span class="glyphicon glyphicon-send"></span>
              Send
            </button>
            &emsp;
            <img v-show="account.status.adding" src="/loading.gif">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "transfer",
  data() {
    return {
      listAccount: [],
      selectedAccount: "Choose account",
      inputMoney: null,
      feeCharger: true,
      inputAccount: null,
      optCode: "",
      description: "",
      accountInfo: {
        _id: null,
        owner: "",
        email: "",
        phone: ""
      },
      transactionId: null,
      error: null
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
    const self = this;
    self.getUserAccounts(self.account.user._id).then(data => {
      if (data && data.success) {
        self.listAccount = data.accounts;
      }
    });
  },
  methods: {
    ...mapActions({
      success: "alert/success",
      error: "alert/error",
      clear: "alert/clear",
      getUserAccounts: "account/getUserAccounts",
      getAccount: "account/getAccount",
      createTransaction: "account/createTransaction",
      verifyTransaction: "account/verifyTransaction"
    }),
    handleSearch() {
      const self = this;
      if (self.inputAccount) {
        self.getAccount(self.inputAccount)
        .then(data => {
          if (data && data.success){
            self.accountInfo = data.account;
          }
        })

      }
    },
    handleTransfer() {
      const self = this;
      if (self.optCode === "") {
        self.error = "please input OPT code";
        return;
      }
      self.verifyTransaction({
        optCode: self.optCode,
        transID: self.transactionId
      })
      .then(data => {
        if(data && !data.success) {
          self.error = data.message
        } else {
          self.selectedAccount = "Choose account";
          self.inputMoney = null;
          self.feeCharger = true;
          self.inputAccount = null;
          self.optCode = "";
          self.description = "";
          self.accountInfo = {
            _id: null,
            owner: "",
            email: "",
            phone: ""
          };
          self.transactionId = null;
          self.error = null;

          $('#myModel').modal('toggle');
        }
      })
    },
    handleSubmit() {
      const self = this;
      if (self.selectedAccount === "Choose account") {
        self.error("Please select your account");
        return;
      }

      const input = parseFloat(self.inputMoney);
      if (input <= 0) {
        self.error("Please input money");
        return;
      }

      if(!self.accountInfo._id) {
        self.error("Please input receive account number");
        return;
      }
      
      self.createTransaction({
        accDes: self.accountInfo._id,
        description: self.description, 
        feeCharger: self.feeCharger,
        total: self.inputMoney,
        accID: self.selectedAccount
      })
      .then(data => {
        if(data && data.success) {
          self.transactionId = data.trans._id;
          $('#myModel').modal('show');
        }
      })
    }
  }
};
</script>

<style lang="css">
</style>