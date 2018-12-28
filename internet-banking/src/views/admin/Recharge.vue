<template>
  <div id="recharge" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">Recharge Money Page</h3>
      </div>
      <div class="panel-body">
        <h3 class="text-muted page-title">Account Recharge Money</h3>
        <form class="form-horizontal text-right">
          <div class="form-group">
            <label for="selectUser" class="col-sm-3">
              Select username:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <select
                id="selectUser"
                class="form-control"
                @change="listUserClicked(selectedUser)"
                v-model="selectedUser"
              >
                <option
                  :selected="selectedUser === 'Choose username'"
                  value="Choose username"
                >Choose username</option>
                <option
                  v-for="user in listUser"
                  :key="user._id"
                  :selected="user === selectedUser"
                  :value="user"
                >{{user.username}} - {{user.name}}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="selectAcc" class="col-sm-3">
              Select accountID:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <select
                id="selectAcc"
                class="form-control"
                @change="listAccountClicked(selectedAccount)"
                v-model="selectedAccount"
              >
                <option
                  :selected="selectedAccount === 'Choose account'"
                  value="Choose account"
                >Choose account</option>
                <option
                  v-for="a in listAccount"
                  :key="a._id"
                  :selected="u === selectedAccount"
                  :value="a._id"
                >{{a.number}}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="txtName" class="col-sm-3">Name:</label>
            <div class="col-sm-8">
              <input type="text" class="plaintext" id="txtName" :value="selectedUser.name" placeholder="Account owner name" readonly>
            </div>
          </div>

          <div class="form-group">
            <label for="txtEmail" class="col-sm-3">Email:</label>
            <div class="col-sm-8">
              <input
                type="text"
                class="plaintext"
                id="txtEmail"
                :value="selectedUser.email"
                placeholder="Account owner email"
                readonly
              >
            </div>
          </div>

          <div class="form-group">
            <label for="numMoney" class="col-sm-3">
              Total Money:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <input type="number" v-model="inputMoney" class="form-control" id="numMoney" placeholder="100.000 VNĐ" required>
            </div>
          </div>

          <div class="form-group text-center">
            <button
              type="button"
              class="btn btn-success"
              @click="handleSubmit"
              :disabled="account.status.adding"
            >
              <span class="glyphicon glyphicon-plus"></span>
              Submit
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
import { userService } from "../../api/user.api.js";

export default {
  name: "recharge",
  data() {
    return {
      listUser: [],
      listAccount: [],
      selectedUser: "Choose username",
      selectedAccount: "Choose account",
      inputMoney: null
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
    const self = this;
    self.getUsers().then(data => {
      if (data && data.success) {
        self.listUser = data.users;
      }
    });
  },
  methods: {
    ...mapActions({
      success: "alert/success",
      error: "alert/error",
      clear: "alert/clear",
      getUsers: "account/getUserList",
      getUserAccounts: "account/getUserAccounts",
      rechargeMoney: "account/rechargeMoney"
    }),
    handleSubmit(e) {
      const self = this;
      if (self.selectedUser === "Choose username" || self.selectedAccount === "Choose account") {
        self.error("Please choose a username & account to submit");
        return;
      }

      if (!self.inputMoney || self.inputMoney === 0) {
        self.error("Please input money to submit");
        return;
      }
      //call api
      const reqBody = {
        accID: self.selectedAccount,
        total: self.inputMoney
      }
      self.rechargeMoney(reqBody)
        .then(data => {
          if(data && data.success) {
            self.selectedAccount = "Choose account"
            self.inputMoney = null
          }
        })
    },
    listUserClicked(username) {
      const self = this;

      if(self.selectedUser !== "Choose username") {
        self.getUserAccounts(self.selectedUser._id).then(data => {
          if (data && data.success) {
            self.listAccount = data.accounts;
          };
        });
      } else {
        self.listAccount = []
        self.selectedAccount = "Choose account"
      }
    },
  }
};
</script>

<style lang="css" scoped>
.plaintext {
  display: block;
  width: 100%;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  margin-bottom: 5px;
  margin-top: -5px;
  font-weight: 700px;
  line-height: 1.5;
  background-color: transparent;
  border: solid transparent;
  border-width: 1px 0;
}
</style>