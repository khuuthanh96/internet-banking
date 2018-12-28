<template>
    <div class="panel panel-success text-left">
        <div class="panel-heading">
            <h3 class="panel-title">
                <span class="glyphicon glyphicon-usd"></span>
                <span class="glyphicon glyphicon-info-sign d-right"></span>

                <button 
                    v-show="option" 
                    class="btn-danger d-right round-button del-btn"
                    data-toggle="modal" 
                    data-target="#myModel"
                    @click="handlerDelBtn"
                    id="delbtn">
                    <span class="glyphicon glyphicon-remove d-right del-icon"></span>
                </button>
            </h3>
        </div>

        <div class="panel-body">
            <b class="acc-number"># No. {{number}}</b>

            <span id="money" class="label label-warning text-right d-right money">
            {{balance.toLocaleString()}} <span class="badge">VNĐ</span>
            </span>
            <label for="money" class="d-right">
                <i>Balance: &emsp;</i>
            </label>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "accountbox",
  data() {
    return {
        isBalance: false
    };
  },
  props: ['number', 'balance', 'option'],
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  methods: {
      handlerDelBtn() {
          this.$emit("delID", this.number)
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

.del-btn {
    position: relative;
    left: 45px;
    bottom: 30px;
}

.del-icon {
    position: absolute;
    left: 4.5px;
    top: calc(50% - 6.5px);;

}

.round-button {
    width:30px;
    height:30px;
    line-height:30px;
    text-align:center;
    text-decoration:none;
    border: 2px solid #f5f5f5;
    border-radius: 50%;
}

#delbtn {
  animation: shake 0.9s cubic-bezier(.36,.07,.19,.97) both;
  animation-iteration-count:infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(1.25px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-1.25px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(1.25px, 0, 0);
  }
}
</style>