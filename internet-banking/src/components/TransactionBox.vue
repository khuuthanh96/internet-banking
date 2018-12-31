<template>
    <div class="panel panel-success text-left">
        <div class="panel-heading">
            <h3 class="panel-title">
                <span class="glyphicon glyphicon-time"></span>
                &emsp;
                <span>{{getDate}}</span>
                <span class="glyphicon glyphicon-info-sign d-right"></span>
            </h3>
        </div>

        <div class="panel-body">
            <b class="acc-number" 
                v-bind:class="{ 'text-info': selectedNumber === numberSrc }"
            ># No. {{numberSrc}}</b>&emsp;
            <span class="glyphicon glyphicon-share-alt"></span>&emsp;
            <b class="acc-number"
             v-bind:class="{ 'text-info': selectedNumber === numberDes }"
            ># No. {{numberDes}}</b>

            <span id="money" class="label label-warning text-right d-right money">
            {{total.toLocaleString()}} <span class="badge">VNĐ</span>
            </span>
            <label for="money" class="d-right">
                <i>Total: &emsp;</i>
            </label>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "transactionbox",
  data() {
    return {
    };
  },
  props: ['numberSrc', 'numberDes', 'total', 'date', 'selectedNumber'],
  computed: {
    ...mapState({
      account: state => state.account
    }),
    getDate() {
        var a = new Date(this.date * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    }
  }
};
</script>

<style lang="css" scoped>
.d-right {
    float: right;
    display: inline-block;
}

.acc-number {
    font-size: 18px;
}

.money {
    font-size: 18px;
}

</style>