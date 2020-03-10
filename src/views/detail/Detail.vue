<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="params" />
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <div class="like">猜你喜欢</div>
      <goods-list :goods="recommends" ref="recommend" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";
import { debounce } from "common/utils";
import { itemListerMixin, backTopMixin } from "common/mixin";

// import { mapActions } from "vuex";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
    // Toast
  },
  mixins: [itemListerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getthemeTopY: null,
      currentIndex: 0
      // message: "",
      // show: false
    };
  },
  created() {
    //保存传入的iid
    this.iid = this.$route.params.iid;

    //根据传入的iid请求相应的数据
    getDetail(this.iid).then(res => {
      // console.log(res);

      //获取顶部轮播数据
      const data = res.result;
      this.topImages = res.result.itemInfo.topImages;

      //获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //获取店铺信息
      this.shop = new Shop(data.shopInfo);

      //保存商品的详情数据
      this.detailInfo = data.detailInfo;

      //获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 获取评论信息
      if (data.rate.Crate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    }),
      //请求推荐数据
      getRecommend().then(res => {
        // console.log(res);

        this.recommends = res.data.list;
      }),
      ///给getthemeTopY赋值(对给getthemeTopY赋值的操作进行防抖)
      (this.getthemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 10);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);

        // console.log(this.themeTopYs);
      }));
  },
  mounted() {},

  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemimglistener);
  },

  methods: {
    // ...mapActions(["addToCart"]),
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getthemeTopY();
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    contentScroll(position) {
      //1.获取Y值
      const positionY = -position.y;

      //2.positionY和主题中的值对比
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // if (
        //   positionY > this.themeTopYs[i] &&
        //   positionY < this.themeTopYs[i + 1]
        // ) {
        //   console.log(i);
        // }

        // if (
        //   this.currentIndex !== i &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // )
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      //3.是否显示回到顶部
      this.isShowBackTop = -position.y > 1000;
    },
    addToCart() {
      //1.获取购物车需要展示的商品信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车里(1.Primise 2.mapActions)
      // this.$store.commit("addCart", product);

      // this.addToCart(product).then(res => {
      //   console.log(res);
      // });

      this.$store.dispatch("addToCart", product).then(res => {
        // this.show = true;
        // this.message = res;

        // setTimeout(() => {
        //   this.show = false;
        //   this.message = " ";
        // }, 1500);
        this.$toast.show(res, 2000);

        console.log(this.$toast);
      });
    }
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 90px);
}

.like {
  text-align: center;
  font-size: 25px;
  line-height: 30px;
  color: var(--color-high-text);
  font-family: "楷体";
}
</style>
