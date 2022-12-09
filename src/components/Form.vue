<template>
  <form :class="[cs.ctn, $style.ctn]" @submit="submit">
    <h1 :class="$style.title">
      <slot name="title" />
    </h1>
    <div :class="$style.inputGroup" v-for="{ name, label } in fields">
      <div :class="$style.label">
        <span>
          {{ $t(label) }}
        </span>
      </div>
      <input
        :name="name"
        :class="$style.input"
        @input="(e) => input(name, e)"
        :value="form.values[name]"
      />
      <div :class="$style.error" v-if="form.errors[name]">
        <span>{{ $t(modelValue.errors[name]) }}</span>
      </div>
    </div>
    <div :class="$style.buttonsGroup">
      <router-link :class="$style.button" to="/">{{
        $t("form.391")
      }}</router-link>
      <button type="submit" :class="$style.button">
        <slot name="next" />
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import cs from "../pages/common.module.scss";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  data: () => ({ cs }),
  props: {
    modelValue: { type: Object, required: true },
    fields: {
      type: Array as PropType<{ name: string; label: string }[]>,
      required: true
    }
  },
  computed: {
    form() {
      return this.modelValue;
    }
  },
  methods: {
    input(name, e) {
      if (this.modelValue) {
        this.modelValue.values[name] = e.target.value;
        this.$emit("update:modelValue", this.modelValue);
      }
    },
    submit(e) {
      e.preventDefault();
      //console.log('submit')
      this.$emit("formSubmit");
    }
  }
});
</script>

<style module lang="scss">
.ctn {
  padding: 40px 50px 50px;
  background: white;
  border-radius: 15px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 26px;
}

.inputGroup {
  & + .inputGroup,
  & + .buttonsGroup {
    margin-top: 40px;
  }
}

.buttonsGroup {
  display: flex;
  justify-content: space-between;
}

.label {
  //color: #808080;

  font-size: 20px;
}

.button,
.input,
.label,
.error {
  font-size: 18px;
}

.error {
  color: #a74646;
  font-size: 16px;
}

.label + .input {
  margin-top: 10px;
}

.input + .error {
  margin-top: 10px;
}

.input {
  padding: 16px 25px;
  width: 100%;
  display: block;
}

.button {
  padding: 15px 40px;

  & + .button {
    margin-left: 40px;
  }
}

.input,
.button {
  border: 1px solid #808080;
  background: white;
  border-radius: 5px;
}
</style>
