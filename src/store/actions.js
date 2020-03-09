import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types";

const actions = {
  addToCart(context, payload) {
    //查找之前数组中是否有该商品
    let oldProduct = context.state.cartList.find(
      item => item.iid === payload.iid
    );

    //判断oldProdect
    if (oldProduct) {
      context.commit(ADD_COUNTER, oldProduct);
    } else {
      payload.count = 1;
      //context.state.cartList.push(payload);
      context.commit(ADD_TO_CART, payload);
    }
  }
};

export default actions;
