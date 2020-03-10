import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types";

const actions = {
  addToCart(context, payload) {
    return new Promise((reslove, reject) => {
      //查找之前数组中是否有该商品
      let oldProduct = context.state.cartList.find(
        item => item.iid === payload.iid
      );

      //判断oldProdect
      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct);
        reslove("当前商品数量加1");
      } else {
        payload.count = 1;
        //context.state.cartList.push(payload);
        context.commit(ADD_TO_CART, payload);
        reslove("成功添加到购物车");
      }
    });
  }
};

export default actions;
