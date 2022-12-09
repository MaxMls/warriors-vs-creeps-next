<template>
  <div>
    shallowRef <b :ref="game.setRefRef">{{ game.obj.a.value }}</b>
  </div>
  <!--	<div>shallowRef <b :ref='game.setShallowRef'>{{ game.obj.a }}</b></div>-->
</template>

<script lang="ts">
import { setup, Vue } from "vue-class-component";
import { onBeforeUnmount, onMounted, ref, shallowRef, triggerRef } from "vue";

class TT {
  private t;

  constructor() {}

  ob = { g: 0 };

  public a = shallowRef(this.ob);

  start() {
    this.t = setInterval(() => {
      this.ob.g++;

      this.a.value = this.ob;
      triggerRef(this.a);
      // console.log(this.ob)
    });
  }

  destroy() {
    clearInterval(this.t);
  }
}

const useRenderGame = () => {
  const refRef = ref(null);
  const shallowRefRef = ref(null);

  const obj = new TT();
  //const refObj = ref(obj)
  //const shallowRefObj = shallowRef(obj)

  onMounted(() => {
    obj.start();
    /*tr = setInterval(() => {
			//refObj.value.a++
			//shallowRefObj.value.a++
			// triggerRef(shallowRefObj)
		})*/
  });

  onBeforeUnmount(() => {
    obj.destroy();
  });

  return {
    setRefRef: (v) => {
      refRef.value = v;
    },
    setShallowRef: (v) => {
      shallowRefRef.value = v;
    },
    obj
  };
};
export default class RTMemberTest extends Vue {
  game = setup(() => useRenderGame());
}
</script>
