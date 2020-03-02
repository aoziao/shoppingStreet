<template>
  <div class="goods-item">
    <img :src="goodsItem.show.img" alt="" @load="imgeLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    imgeLoad() {
      this.$bus.$emit("itemImageLoad");
    }
  }
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
}

.goods-item img {
  width: 148.8px;
  height: 223.19px;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden; /* verflow 属性规定当内容溢出元素框时发生的事情。 */
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis; /*  text-overflow 属性规定当文本溢出包含元素时发生的事情。*/
  white-space: nowrap; /* 规定段落中的文本不进行换行 */
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
