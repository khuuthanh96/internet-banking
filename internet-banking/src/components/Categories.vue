<template>
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Categories</h3>
    </div>
    <div v-if="account.status.loggedIn && account.user.roles === 'admin'" class="list-group">
      <router-link
        v-for="c in listAd"
        :key="c.id"
        :to="'/' + c.path"
        class="list-group-item"
        :class="{active: selected === c.id}"
        v-on:click.native="categoryClicked(c.id)"
      >{{c.name}}</router-link>
    </div>
    <div v-else>
       <router-link
        v-for="c in listUser"
        :key="c.id"
        :to="'/' + c.path"
        class="list-group-item"
        :class="{active: selected === c.id}"
        v-on:click.native="categoryClicked(c.id)"
      >{{c.name}}</router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { adCategories, userCategories } from "../category.js";
export default {
  name: "Categories",

  data() {
    return {
      listAd: [],
      listUser: [],
      selected: -1
    };
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
    var self = this;
    self.listAd = adCategories;
    self.listUser = userCategories;
  },
  methods: {
    categoryClicked(id) {
      this.selected = id;
    }
  }
};
</script>

<style lang="css" scoped>
.router-link active {
  background-color: #ddd;
  border-color: #ddd;
}

.list-group-item.active {
  z-index: 2;
  color: #000;
  background-color: #D3D3D3;
  border-color: #D3D3D3;
}
</style>