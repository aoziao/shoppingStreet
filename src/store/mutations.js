import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types";

const mutations = {
  //mutations唯一的目的就是修改state的状态
  //mutations中的每一个方法尽量完成的事件比较单一一点
  [ADD_COUNTER](state, payload) {
    payload.count++;
  },
  [ADD_TO_CART](state, payload) {
    state.cartList.push(payload);
  }
};

export default mutations;
