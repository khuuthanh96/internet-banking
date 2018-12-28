<template>
  <div id="addaccount" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">Add Account Page</h3>
      </div>
      <div class="panel-body">
        <h3 class="text-muted">New Account</h3>
        <form class="form-horizontal text-right">
          <div class="form-group">
            <label for="txtUsername" class="col-sm-3">
              Select username:
              <span class="text-danger">(*)</span>
            </label>
            <div class="col-sm-8">
              <select class="form-control" @change="listUserClicked(selectedUser)" v-model="selectedUser">
                <option :selected="selectedUser === 'Choose username'" value="Choose username">Choose username</option>
                <option
                  v-for="u in listUser"
                  :key="u._id"
                  :selected="u === selectedUser"
                  :value="u"
                >{{u.username}} - {{u.name}}</option>
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
            <label for="txtPhone" class="col-sm-3">Phone:</label>
            <div class="col-sm-8">
              <input
                type="text"
                class="plaintext"
                id="txtPhone"
                :value="selectedUser.phone"
                placeholder="Account owner phone"
                readonly
              >
            </div>
          </div>

          <div class="form-group text-center">
            <button type="button" class="btn btn-success" @click="handleSubmit" :disabled="account.status.adding">
              <span class="glyphicon glyphicon-plus"></span>
              Submit
            </button>
            &emsp;
            <img
              v-show="account.status.adding"
              src="/loading.gif"
            >
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
  name: "addaccount",
  data() {
    return {
      listUser: [],
      selectedUser: "Choose username"
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
    const self = this;
    userService.getAllUser()
      .then(data => {
        if (data && data.success) {
          self.listUser = data.users;
        } else {
          self.error(data.message);
        }
      })
  },
  methods: {
    ...mapActions({
      success: "alert/success",
      error: "alert/error",
      clear: "alert/clear",
      addAccount: "account/addAccount"
    }),
    handleSubmit(e) {
      const self = this;
      const { selectedUser } = self;
      if (selectedUser === "Choose username") {
        self.error("Please choose a username to submit");
        return;
      }
      //call api
      self.addAccount(selectedUser._id)
      .then(data => {
        if(data && data.success) {
          self.selectedUser = "Choose username";
        }
      })
      
    },
    listUserClicked(username) {
      this.listUser.forEach(u => {
        if (u.username === username) {
            this.selectedUser = u;
        }
      });
    }
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