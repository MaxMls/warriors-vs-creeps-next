<template>
  <router-view />
  <LanguageSwitcher />
</template>

<script lang="ts">
import { APP_PROVIDER } from "./context/network.context";
import { defineComponent, provide } from "vue";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";

export default defineComponent({
  components: { LanguageSwitcher },
  setup() {
    //const {t} = useI18n({useScope: 'global'}) // call `useI18n`, and spread `t` from  `useI18n` returning
    provide(APP_PROVIDER, {});

    //return {t} // return render context that included `t`
  }
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap");

body {
  font-family: "Ubuntu", sans-serif;
  font-size: 14px;
}

* {
  box-sizing: border-box;
  line-height: 130%;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  text-align: inherit;

  display: block;
  appearance: inherit;
  -webkit-writing-mode: inherit;
  text-rendering: inherit;
  color: inherit;
  letter-spacing: inherit;
  word-spacing: inherit;
  text-transform: inherit;
  text-indent: inherit;
  text-shadow: inherit;
  align-items: inherit;
  font: inherit;
}

button[disabled] {
  cursor: inherit;
}

button,
input {
  border: none;
  border-radius: 0;
  background: transparent;
  font-size: inherit;
}

#app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
}

html {
}

$col1: rgb(211, 244, 255, 1);
$col2: rgba(255, 232, 198, 1);
body {
  background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(213, 244, 254, 0.26) 100%
    ),
    linear-gradient(180deg, $col1 0%, $col2 100%), url("./assets/img.png");

  background-blend-mode: hard-light;

  //	backdrop-filter: opacity(.2);
}
</style>
