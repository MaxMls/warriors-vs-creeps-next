<template>
  <Form :fields="fields" v-model="form" @formSubmit="submit">
    <template v-slot:title>{{ $t("pages.create.8803") }}</template>
    <template v-slot:next>{{ $t("pages.create.6548") }}</template>
  </Form>
</template>

<script lang="ts">
import { APP_PROVIDER } from "../context/network.context";
import { defineComponent, inject, onMounted, ref, unref, watch } from "vue";
import { Room } from "../engine/lobby/server-events-lobby";
import Form from "../components/Form.vue";
import { useRouter } from "vue-router";
import { TUnitSkin } from "../engine/renders/vue-render";
import { RequestError } from "../engine/lobby/request-error";

export default defineComponent({
  components: { Form },
  setup() {
    const app = unref(inject(APP_PROVIDER) as { room?: Room });

    const router = useRouter();
    const form = ref({
      values: { name: "" },
      errors: { name: null } as any
    });

    //const {t} = useI18n()

    const fields = [{ name: "name", label: "form.0" }];

    onMounted(() => {
      let name = localStorage.getItem("name");
      form.value.values.name = name || "";
    });

    watch(form.value.values, () => {
      localStorage.setItem("name", form.value.values.name);
    });

    return {
      form,
      fields,
      async submit() {
        const { name } = form.value.values;

        if (!name) {
          form.value.errors.name = "form.2";
        } else if (name.length > 25) {
          form.value.errors.name = "form.3";
        } else {
          try {
            const skin = (localStorage.getItem("skin") ?? "ame") as TUnitSkin;
            app.room?.destroy();
            app.room = new Room();
            app.room.setCurrentPlayerData({ skin, name });
            await router.push("/room");
          } catch (e) {
            if (e instanceof RequestError) {
              form.value.errors = e.data;
            } else {
              throw e;
            }
          }
        }
      }
    };
  }
});
</script>
