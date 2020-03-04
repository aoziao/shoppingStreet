<template>
  <div id="detail">
    <detail-nav-bar />
    <detail-swiper :topImages="topImages" />
    <detail-base-info :goods="goods" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";

import { getDetail, Goods } from "network/detail";
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {}
    };
  },
  created() {
    //保存传入的iid
    this.iid = this.$route.params.iid;

    //根据传入的iid请求相应的数据
    getDetail(this.iid).then(res => {
      console.log(res);

      //获取顶部轮播数据
      const data = res.result;
      this.topImages = res.result.itemInfo.topImages;

      //获取去商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
    });
  }
};
</script>

<style scoped></style>
