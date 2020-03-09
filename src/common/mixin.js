import { debounce } from "./utils";
import BackTop from "components/content/backTop/BackTop";
export const itemListerMixin = {
  data() {
    return {
      itemimglistener: null
    };
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);

    this.itemimglistener = () => {
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemimglistener);
  }
};

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    };
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    }
  }
};

/** 
 * Vue.mixin :全局注册混入对象，注意使用！ 一旦使用全局混入对象，
 * 将会影响到 所有 之后创建的 Vue 实例。使用恰当时，可以为自定义对象注入处理逻辑。
 * 
 *mixins 选项接受一个混入对象的数组。这些混入实例对象可以像正常的实例对象一样包含选项，
 他们将在 Vue.extend() 里最终选择使用相同的选项合并逻辑合并。 */
