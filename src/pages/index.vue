<template>
  <div>
    <h1 :class="$style.title">{{ $t("pages.index.warriorsVsCreeps") }}</h1>
    <div :class="$style.buttonsGroup">
      <router-link to="/create" :class="$style.button">{{
        $t("pages.index.7042")
      }}</router-link>
      <router-link to="/join" :class="$style.button">{{
        $t("pages.index.4706")
      }}</router-link>
    </div>
    <div :class="[cs.linksGroup, $style.linksGroup]">
      <div :class="[cs.link, $style.link]">
        <a
          target="_blank"
          href="https://github.com/blazzer-band/Warriors-vs-Creeps"
          >{{ $t("pages.index.warriorsVsCreeps1") }}</a
        >
      </div>
      <div :class="[cs.link, $style.link]">
        <router-link to="/rules">{{ $t("pages.index.5920") }}</router-link>
      </div>
    </div>
    <div :class="[cs.linksGroup, $style.linksGroup]">
      <div :class="[cs.link, $style.link]">
        <a target="_blank" href="https://walfiegif.wordpress.com/">{{
          $t("pages.index.walfieGif")
        }}</a>
      </div>
      <div :class="[cs.link, $style.link]">
        <a
          target="_blank"
          href="https://github.com/blazzer-band/Warriors-vs-Creeps"
          >{{ $t("pages.index.981") }}</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cs from "./common.module.scss";

export default defineComponent({
  data: () => ({ cs })
});
</script>

<style module lang="scss">
.linksGroup {
  display: flex;
  justify-content: center;

  & + .linksGroup {
    margin-top: 40px;
  }

  .link {
    margin: 0 40px;
  }
}

.title {
  text-align: center;
  font-size: 34px;
  color: #000;
  color: #de8d13;
  opacity: 0.7;

  font-size: 66px;
  font-weight: 600;

  & + .buttonsGroup {
    margin-top: 65px;
  }
}

.button {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  display: inline-block;
  padding: 15px 40px;
  border: 1px solid #eee;
  font-size: 20px;

  transition: 0.1s;

  &:hover {
    // border-color: #4e78de;
    background: #d1dcff;
    background: rgb(255, 161, 39, 0.7);
    color: #0f64ff;
    color: #fff;
    //order-color: #4b8bff;
    border-color: #fff;
    border-width: 2px;
    margin: -1px;
  }
}

.buttonsGroup {
  display: grid;
  grid-gap: 65px;
  grid-auto-flow: column;
  justify-content: center;

  & + .linksGroup {
    margin-top: 75px;
  }
}

.link {
  font-size: 20px;

  border-bottom: 1px solid #366bff;
  color: #3d71ff;
}
</style>
