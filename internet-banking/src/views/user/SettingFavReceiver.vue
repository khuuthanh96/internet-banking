<template>
  <div id="receiver" class="text-center">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">Setting</h3>
      </div>
      <div class="panel-body">
        <!-- <div class="row"> -->
        <h3 class="text-muted page-title">Favourite Receiver</h3>

        <div class="form-group col-sm-5">
          <label for="txtName" class="col-sm-3">Name:</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="txtName" v-model="name" placeholder="New hint name">
          </div>
        </div>

        <div class="form-group col-sm-5">
          <label for="txtName" class="col-sm-3">Account:
              <span class="text-danger text-left">(*)</span>
          </label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="txtName" v-model="accNumber" placeholder="Account number">
          </div>
        </div>

        <div class="form-group col-sm-2">
           <button
              type="button"
              class="btn btn-success"
              @click="handleSubmit"
              :disabled="account.status.adding"
            >
              <span class="glyphicon glyphicon-plus"></span>
              Add
            </button>
            &emsp;
            <img v-show="account.status.adding" src="/loading.gif">
        </div> 

        <!-- Table -->
        <table class="table">
          <tr>
            <th class="text-center" style="font-size: 15px;"><b>Hint name</b></th> 
            <th class="text-center" style="font-size: 15px;"><b>Account number</b></th>
          </tr>

          <tr 
            v-for="h in hintList"
            :key="h._id"
          >
            <td>{{h.username}}</td> 
            <td>{{h.accNumber}}</td>
          </tr>
        </table>
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
      hintList: [],
      name: "",
      accNumber: ""
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
   const self = this;
   self.getHintOfUser(self.account.user._id)
    .then(data => {
      if(data && data.success) {
        self.hintList = data.hintList;
      }
    })
  },
  methods: {
    ...mapActions({
      success: "alert/success",
      error: "alert/error",
      clear: "alert/clear",
      getHintOfUser: "account/getHintOfUser",
      addHintForUser: "account/addHintForUser"
    }),
    handleSubmit() {
      const self = this;
      if(self.accNumber == "") {
        self.error("Account number is required");
        return;
      }

      self.addHintForUser({
        username: self.name,
        accNumber: self.accNumber,
        userId: self.account.user._id
      })
      .then(data => {
        if(data && data.success) {
          self.hintList.push(data.hint);
          self.name = "";
          self.accNumber = "";
        }
      })
    }
  }
};
</script>

<style lang="css">
</style>