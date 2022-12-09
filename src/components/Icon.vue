<template>
  <use> </use>
</template>

<script lang="ts">
const modules = import.meta.glob("../assets/**/*.svg");
console.log({ modules });

for (const modulesKey in modules) {
  console.log(modulesKey.split("../assets/").pop());
  modules[modulesKey]().then((r) => {
    console.log(r);
  });
}
export default {
  name: "Icon"
};
</script>

<style scoped></style>
