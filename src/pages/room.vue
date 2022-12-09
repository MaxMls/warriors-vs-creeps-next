<template>
  <div :class="[cs.ctn, style.ctn]">
    <div :class="[style.buttonsGroup, style.buttonsTop]">
      <div>
        <button
          type="button"
          @click="addBot"
          :class="[style.buttonTop, style.button]"
        >
          {{ $t("pages.room.5952") }}
        </button>
        <button
          type="button"
          :class="[style.buttonTop, style.button]"
          @click="getRoomCode"
        >
          {{ $t("pages.room.2605") }}
        </button>
      </div>
      <div>
        <button
          type="button"
          @click="exit"
          :class="[style.buttonTop, style.button]"
        >
          {{ $t("pages.room.4409") }}
        </button>
      </div>
    </div>
    <div :class="[style.slotsGroup]">
      <div v-for="(p, i) in players" :class="[style.slotCtn]">
        <button
          :disabled="p.ownerId !== player.selfId && p.selfId !== player.selfId"
          type="button"
          :class="[style.slotImage, { [style.slotImage_ready]: p.data.ready }]"
          :style="`background: ${
            ['#F7AEF8', '#B388EB', '#8093F1', '#72DDF7'][i % 4]
          }`"
          @click="skinChanger.open(p.selfId)"
        >
          <UnitComponent :skin="p.data.skin" state="idle" />
        </button>
        <div
          :class="[
            style.slotName,
            { [style.slotNameMe]: p.selfId === player.selfId }
          ]"
        >
          {{ p.data.name }}
        </div>
        <button
          type="button"
          @click="kickBot(p.selfId)"
          :class="[style.slotKick]"
          :disabled="p.ownerId !== player.selfId || p.selfId === player.selfId"
        >
          {{ $t("pages.room.1172") }}
        </button>
      </div>

      <div v-for="() in fillSlots" :class="[style.slotCtn]">
        <div :class="[style.slotImage]" />
        <div :class="[style.slotName]">{{ $t("pages.room.3553") }}</div>
      </div>
    </div>
    <div :class="[style.buttonsGroup, style.buttonsBot]">
      <button
        @click="ready(false)"
        v-if="player.data.ready"
        type="button"
        :class="[style.buttonStart, style.button, style.buttonStart_ready]"
      >
        {{ $t("pages.room.9245") }}
      </button>
      <button
        @click="ready(true)"
        v-else
        type="button"
        :class="[style.buttonStart, style.button]"
      >
        {{ $t("pages.room.6109") }}
      </button>
    </div>
  </div>
  <div :class="style.popup" v-if="skinChanger.isOpen">
    <button :class="style.popupClose" @click="skinChanger.close" />
    <div :class="style.skinSelectCtn">
      <div :class="style.skinSelectTitle">{{ $t("pages.room.9997") }}</div>
      <div :class="style.skinSelectItems">
        <div :class="style.skinSelectItemCtn" v-for="s in skinChanger.values">
          <button
            type="button"
            :class="style.skinSelectItem"
            @click="skinChanger.set(s)"
          >
            <UnitComponent :skin="s" state="idle" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  ref,
  unref
} from "vue";
import { APP_PROVIDER } from "../context/network.context";

import { useRouter } from "vue-router";
import cs from "./common.module.scss";
import style from "./room.module.scss";
import UnitComponent from "../components/UnitComponent.vue";
import { heroesSkins, TUnitSkin } from "../engine/renders/vue-render";
import { genId, IRoomPlayer, Room } from "../engine/lobby/server-events-lobby";
import cloneDeep from "lodash/cloneDeep";

const useSkinChanger = (room: Room) => {
  const playerId = ref<string | null>(null);
  const isOpen = computed(() => playerId.value !== null);
  console.log({ playerId: isOpen.value });
  return {
    isOpen,
    open(_playerId: string) {
      playerId.value = _playerId;
    },
    close() {
      playerId.value = null;
    },
    set(skin: TUnitSkin) {
      room.updatePlayerData(playerId.value!, { skin });
      playerId.value = null;
    },
    values: heroesSkins
  };
};

export default defineComponent({
  inheritAttrs: false,
  components: { UnitComponent },
  data: () => ({ cs, style }),
  setup() {
    const app = unref(inject(APP_PROVIDER))! as { room: Room };
    const { room } = app;

    const router = useRouter();

    const addBot = () => {
      const id = genId();
      room.addPlayer({
        selfId: id,
        ownerId: room.player.selfId,
        data: {
          skin: "ame",
          name: "bot",
          ready: true
        }
      });
    };

    const kickBot = (id) => {
      room.removePlayer(id);
    };

    const exit = async () => {
      await router.push("/");
      await room.destroy();
      // @ts-ignore
      delete app.room;
    };

    const getRoomCode = async () => {
      const key = await room.openRoom();
      try {
        await navigator.clipboard.writeText(key);
      } catch (e) {
        prompt("Copy code:", key);
      }
    };

    const ready = (ready) => {
      room.updatePlayerData(room.player.selfId, { ready });
    };

    const players = ref<IRoomPlayer[]>([]);
    const player = ref<IRoomPlayer>({ selfId: "0", ownerId: "0", data: {} });
    const playersListener = () => {
      players.value = cloneDeep(room.players);
      player.value = cloneDeep(room.player);

      if (!players.value.find((p) => !p.data.ready)) {
        router.push("/game");
      }
    };

    onBeforeMount(() => {
      if (room) {
        playersListener();
        room.on("players", playersListener);
      } else {
        router.push("/");
      }
    });

    onBeforeUnmount(() => {
      room?.off("players", playersListener);
    });

    return {
      addBot,
      kickBot,
      exit,
      getRoomCode,
      ready,
      players,
      player,
      skinChanger: reactive(useSkinChanger(room)),
      fillSlots: computed(() => Math.max(0, 4 - players.value.length))
    };
  }
});
</script>
