<template>
  <div :class="[sty.icons]">
    <SvgIcon
      v-for="e in cardIcons"
      :class="[sty.icon, { [sty['icon_' + e.t]]: !!topCard }]"
      :name="e.i"
    />
  </div>
  <div :class="[sty.name]">
    {{
      damageCard
        ? $t("card.0")
        : noDefectCard
        ? $t("cards." + noDefectCardIndex + ".name")
        : $t("card.1")
    }}
  </div>
  <div
    v-if="topCard"
    :class="[
      sty.ctn,
      cardTypeClass,
      {
        [sty.ctn_single]: single !== null,
        [sty.ctn_outline]: outline,
        [sty.ctn_active]: outlineActive
      }
    ]"
  >
    <div v-if="damageCard" :class="[sty.module, sty.module_damage]">
      <div :class="sty.step">
        <SvgIcon
          :class="[sty.icon]"
          :name="stepIcon(damageCard?.levels[0].steps[0])"
        />
        <div :class="sty.desc">
          {{ desc(damageCard?.levels[0].steps[0], 0, 0, damageCardId) }}
        </div>
      </div>
    </div>

    <div
      v-if="noDefectCard"
      v-for="(l, i) in noDefectCard?.levels"
      :class="[
        sty.module,
        { [sty.module_active]: i === level, [sty.module_damaged]: damageCard }
      ]"
    >
      <div :class="[sty.step]" v-for="(s, stepInd) in l.steps">
        <SvgIcon :class="[sty.icon]" :name="stepIcon(s)" />
        <div :class="sty.desc">
          {{ desc(s, i, stepInd) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { cardsJSON, ICardStep } from "../engine/cards";
import {
  directionToDeg,
  ECardAction,
  ECardType,
  TCardId
} from "../engine/types";
import sty from "./CardComponent.module.scss";
import SvgIcon from "./SvgIcon.vue";
import { computed, defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: { SvgIcon },
  data() {
    return { sty };
  },
  props: {
    stack: { type: Array as PropType<TCardId[]>, required: false, default: [] },
    idx: { type: Number as PropType<TCardId>, required: false, default: null },
    select: { type: Boolean, required: false, default: false },
    active: { type: Boolean, required: false, default: null }
  },
  setup: (props, context) => {
    const singleId = computed(() => (props.idx !== null ? props.idx : null));
    const single = computed(() =>
      singleId.value ? cardsJSON[singleId.value] : null
    );
    const outline = computed(() => props.select);
    const outlineActive = computed(() => props.active);

    const topCardId = computed(
      () => singleId.value ?? props.stack[props.stack.length - 1]
    );
    const topCard = computed(() => single.value ?? cardsJSON[topCardId.value]);

    const damageCardId = computed(() => {
      const c = topCard.value;
      return c?.type === ECardType.Defect ? topCardId.value : undefined;
    });
    const damageCard = computed(() => {
      return damageCardId.value ? cardsJSON[damageCardId.value] : null;
    });

    const cardIcons = computed(() => {
      const icons = {
        [ECardType.Electro]: "types-lightning",
        [ECardType.Metal]: "types-crown",
        [ECardType.Fire]: "types-fire",
        [ECardType.Computer]: "types-mech"
      };
      const res: { i: string; t: string }[] = [];
      if (topCard.value) {
        for (
          let i = 0;
          i <
          props.stack.length -
            (damageCard.value ? 1 : 0) +
            (props.idx !== null ? 1 : 0);
          i++
        )
          res.push({
            i: icons[noDefectCard.value.type],
            t: ECardType[noDefectCard.value.type]
          });
        if (damageCard.value)
          res.push({ i: "types-warning", t: ECardType[ECardType.Defect] });
      } else
        for (const icon in icons)
          res.push({ i: icons[icon], t: ECardType[icon] });
      return res;
    });
    const level = computed(
      () => props.stack.length - 1 - (damageCard.value ? 1 : 0)
    );

    const noDefectCardIndex = computed(() => {
      const ndc = props.stack.filter(
        (v) => cardsJSON[v].type !== ECardType.Defect
      );
      return props.idx ?? ndc[ndc.length - 1];
    });

    const noDefectCard = computed(() => {
      return cardsJSON[noDefectCardIndex.value];
    });

    const cardTypeClass = computed(() =>
      noDefectCard.value ? sty["ctn_" + ECardType[noDefectCard.value.type]] : ""
    );

    function stepIcon(step: ICardStep) {
      const icons = {
        [ECardAction.Rotate]: "rotate",
        [ECardAction.Attack]: "attack",
        [ECardAction.Move]: "move"
      };
      return icons[step.action];
    }

    const { t } = useI18n();

    const desc = (
      step: ICardStep,
      levelInd,
      stepInd,
      cardIndex = noDefectCardIndex.value
    ) => {
      if (step.desc) {
        return t(`cards.${cardIndex}.levels.${levelInd}.${stepInd}`);
      } else if (step.action === ECardAction.Rotate) {
        return step.directions.length === 4
          ? t("card.2")
          : t("card.3", {
              values: step.directions.map((v) => directionToDeg(v)).join(", ")
            });
      } else if (step.action === ECardAction.Move) {
        return "move";
      } else if (step.action === ECardAction.Attack) {
        return "attack";
      }
    };

    return {
      single,
      outline,
      outlineActive,
      topCard,
      damageCard,
      cardIcons,
      level,
      noDefectCard,
      cardTypeClass,
      stepIcon,
      desc,
      damageCardId,
      noDefectCardIndex
    };
  }
});
</script>
