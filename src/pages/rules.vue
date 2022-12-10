<template>
  <div :class="$style.c">
    <router-link to="/">{{ $t("game.3") }}</router-link>
    <p />
    <h1>{{ $t("pages.rules.7117") }}</h1>
    <p>
      <a
        target="_blank"
        href="https://github.com/blazzer-band/Warriors-vs-Creeps/wiki"
        >{{ $t("pages.rules.6794") }}</a
      ><br />{{ $t("pages.rules.8365") }}
    </p>
    <a :id="hid('index')"
      ><h2>{{ $t("pages.rules.8853") }}</h2></a
    >
    <div style="margin-left: 20px; margin-top: 20px">
      <ul>
        <li>
          <a :href="h('map')">{{ $t("pages.rules.3365") }}</a>
        </li>
        <li>
          <a :href="h('monst')">{{ $t("pages.rules.84") }}</a>
        </li>
        <li>
          <a :href="h('term')">{{ $t("pages.rules.4868") }}</a>
        </li>
        <li>
          <a :href="h('stack')">{{ $t("pages.rules.6701") }}</a>
        </li>
        <li>
          <a :href="h('damage')">{{ $t("pages.rules.288") }}</a>
        </li>
        <li>
          <a :href="h('uti')">{{ $t("pages.rules.6154") }}</a>
        </li>
        <li>
          <a :href="h('bots')">{{ $t("pages.rules.8930") }}</a>
        </li>
        <li>
          <a :href="h('disconnect')">{{ $t("pages.rules.10000") }}</a>
        </li>
      </ul>
    </div>

    <a :href="h('index')" :id="hid('map')"
      ><h2>{{ $t("pages.rules.8106") }}</h2></a
    >

    <div style="width: 500px">
      <GameMapComponent v-if="map3" :renderMap="map3" />
    </div>
    <p>{{ $t("pages.rules.7338") }}<br />{{ $t("pages.rules.2651") }}</p>

    <a :href="h('index')" :id="hid('monst')"
      ><h2>{{ $t("pages.rules.367") }}</h2></a
    >
    <div style="width: 500px">
      <GameMapComponent v-if="map1" :renderMap="map1" />
    </div>
    <p>{{ $t("pages.rules.4950") }}</p>

    <div style="width: 500px">
      <GameMapComponent v-if="map2" :renderMap="map2" />
    </div>
    <p>{{ $t("pages.rules.5146") }}</p>
    <p>{{ $t("pages.rules.4867") }}</p>

    <a :href="h('index')" :id="hid('term')"
      ><h2>{{ $t("pages.rules.3706") }}</h2></a
    >
    <p>{{ $t("pages.rules.7118") }}</p>
    <p>
      {{ $t("pages.rules.4345") }}<b>{{ $t("pages.rules.9728") }}</b>
    </p>
    <p>{{ $t("pages.rules.5991") }}</p>
    <p>
      <router-link to="/cards">{{ $t("pages.rules.8807") }}</router-link>
    </p>
    <a :href="h('index')" :id="hid('stack')"
      ><h2>{{ $t("pages.rules.1963") }}</h2></a
    >

    <div
      style="
        display: grid;
        grid-auto-columns: 220px;
        grid-gap: 20px;
        grid-auto-flow: column;
      "
    >
      <div>
        <CardComponent :stack="[1]" />
      </div>
      <div>
        <CardComponent :stack="[0, 2]" />
      </div>
      <div>
        <CardComponent :stack="[0, 1, 0]" />
      </div>
    </div>
    <p></p>
    <p>{{ $t("pages.rules.8547") }}</p>
    <p>{{ $t("pages.rules.8391") }}</p>
    <p>{{ $t("pages.rules.5478") }}</p>
    <p>{{ $t("pages.rules.6703") }}</p>
    <p>{{ $t("pages.rules.7846") }}</p>
    <a :href="h('index')" :id="hid('damage')">
      <h2 style="display: flex; align-items: center; gap: 10px">
        {{ $t("pages.rules.4072") }}
        <SvgIcon :class="$style.icon" name="types-warning" />
      </h2>
    </a>
    <div
      style="
        display: grid;
        grid-auto-columns: 220px;
        grid-gap: 20px;
        grid-auto-flow: column;
      "
    >
      <div>
        <CardComponent :stack="[1, 13]" />
      </div>
    </div>
    <p></p>
    <p>{{ $t("pages.rules.5449") }}</p>
    <a :href="h('index')" :id="hid('uti')">
      <h2 style="display: flex; align-items: center; gap: 10px">
        {{ $t("pages.rules.5098") }}
        <SvgIcon :class="$style.icon" name="cran" />
      </h2>
    </a>
    <p>{{ $t("pages.rules.958") }}</p>
    <p>{{ $t("pages.rules.8599") }}</p>
    <ul>
      <li>
        <SvgIcon :class="$style.icon" name="trash" />
        <p>{{ $t("pages.rules.7471") }}</p>
      </li>
      <li>
        <SvgIcon :class="$style.icon" name="fix" />
        <p>
          {{ $t("pages.rules.3469") }}
          <SvgIcon :class="$style.icon" name="types-crown" />
          и
          <SvgIcon
            style="--icon-color: #6e286b"
            :class="$style.icon"
            name="types-fire"
          />
          {{ $t("pages.rules.4250") }}
        </p>
      </li>
      <li>
        <SvgIcon :class="$style.icon" name="cranMove" />
        <p>
          {{ $t("pages.rules.7428") }}
          <SvgIcon :class="$style.icon" name="types-lightning" />
          и
          <SvgIcon :class="$style.icon" name="types-mech" />
          {{ $t("pages.rules.4103") }}
        </p>
      </li>
    </ul>
    <a :href="h('index')" :id="hid('bots')"
      ><h2>{{ $t("pages.rules.8430") }}</h2></a
    >
    <p>{{ $t("pages.rules.3350") }}</p>
    <p>{{ $t("pages.rules.5524") }}</p>
    <p>{{ $t("pages.rules.7192") }}</p>
    <a :href="h('index')" :id="hid('disconnect')"
      ><h2>{{ $t("pages.rules.10000") }}</h2></a
    >
    <p>{{ $t("pages.rules.10001") }}</p>
    <p>{{ $t("pages.rules.10002") }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import GameMapComponent from "../components/GameMapComponent.vue";
import { GameMap } from "../engine/game-map";
import { Unit } from "../engine/unit";
import { EDirection, EHighlight, EUnitType } from "../engine/types";
import SvgIcon from "../components/SvgIcon.vue";
import CardComponent from "../components/CardComponent.vue";

export default defineComponent({
  components: { CardComponent, SvgIcon, GameMapComponent },
  name: "game",
  mounted() {
    // setTimeout(() => this.scrollFix(this.$route.hash), 1);
  },
  methods: {
    h(tag) {
      return "#/rules#" + tag;
    },
    hid(tag) {
      return "/rules#" + tag;
    }
  },
  setup() {
    let keyGen = 0;
    const map1 = ref<any | null>(null);
    const map2 = ref<any | null>(null);
    const map3 = ref<any | null>(null);

    onMounted(() => {
      {
        const map: any = {};
        map.gameMap = new GameMap([
          [2, 0, 0, 0, 0, 0],
          [0, 2, 0, 2, 2, 0],
          [0, 0, 0, 0, 0, 0]
        ]);
        map.cellsToSelect = new Map();
        map.cellsDirection = new Map();
        map.onCellClick = () => {};
        map1.value = map;
      }

      {
        const map: any = {};
        map.gameMap = new GameMap([
          [2, 0, 0, 0, 0, 0],
          [0, 2, 1, 2, 2, 0],
          [0, 0, 3, 0, 0, 0]
        ]);
        const hero = new Unit(EUnitType.Hero);
        // @ts-ignore
        map.units = new Map([
          ...map.gameMap.getAllCellsByType(2).map((cell) => {
            return [
              new Unit(EUnitType.Creep),
              {
                state: "idle",
                skin: "greenSlime",
                cell,
                key: ++keyGen
              }
            ];
          }),
          ...map.gameMap.getAllCellsByType(1).map((cell) => {
            return [
              new Unit(EUnitType.Bomb),
              {
                state: "idle",
                skin: "cake",
                cell,
                key: ++keyGen
              }
            ];
          }),
          ...map.gameMap.getAllCellsByType(3).map((cell) => {
            return [
              hero,
              {
                state: "idle",
                skin: "ame",
                cell,
                key: ++keyGen
              }
            ];
          })
        ]);
        map.cellsToSelect = new Map();
        map.cellsDirection = new Map([[hero, EDirection._270]]);
        map.onCellClick = () => {};

        map2.value = map;
      }
      {
        const map: any = {};

        map.gameMap = new GameMap([
          [0, 0, 0, 0, 0, 0],
          [0, 1, 1, 3, 0, 0],
          [0, 0, 0, 0, 0, 0]
        ]);
        let unit = new Unit(EUnitType.Hero);
        let cake = new Unit(EUnitType.Bomb);

        const units = [
          (cell) => [
            cake,
            {
              state: "idle",
              skin: "cake",
              cell,
              key: ++keyGen
            }
          ],
          (cell) => {
            return [
              unit,
              {
                state: "idle",
                skin: "ame",
                cell,
                key: ++keyGen
              }
            ];
          }
        ];

        map.units = new Map([
          ...map.gameMap.getAllCellsByType(1).map((cell) => {
            // @ts-ignore
            return units.pop()(cell);
          })
        ]);

        setTimeout(() => {
          // @ts-ignore
          map3.value.cellsToSelect.set(map.gameMap?.getCell(3, 1), {
            highlight: EHighlight.Move,
            ind: 0
          });
        }, 0);

        map.cellsToSelect = new Map();
        map.cellsDirection = new Map([[unit, EDirection._90]]);
        map.onCellClick = () => {
          {
            const unitInstance = map3.value!.units.get(unit)!;
            unitInstance.cell = map.gameMap?.getCell(2, 1);
            unitInstance.state = "walk";
            setTimeout(() => {
              unitInstance.state = "idle";
            }, 500);
          }
          {
            const unitInstance = map3.value!.units.get(cake)!;
            unitInstance.cell = map.gameMap?.getCell(3, 1);
            unitInstance.state = "walk";
            setTimeout(() => {
              unitInstance.state = "idle";
            }, 500);
          }
          map3.value!.cellsToSelect.clear();
        };
        map3.value = map;
      }
    });

    return { map1, map2, map3 };
  }
});
</script>

<style module lang="scss">
.c {
  --icon-color: black;
  font-size: 20px;
  width: 100%;
  padding: 20px;
  max-width: 1200px;
  margin: auto;

  * {
    line-height: 150%;
  }

  p {
    margin-top: 10px;
    margin-bottom: 30px;
  }

  h2 {
    margin-top: 30px;
    margin-bottom: 10px;
  }

  a {
    color: #1d4fd0;
    border-bottom: 1px solid #1d4fd0;
  }

  a[id] {
    color: #333;

    &[href] {
      h2 {
        display: flex;
        align-items: center;
        border-bottom: none;

        &:before {
          font-size: 25px;
          margin-right: 10px;
          display: block;
          content: "☝";
        }
      }
    }
  }

  li {
    margin-bottom: 20px;
    gap: 10px;
  }
}

.icon {
  --icon-color: black;
  width: 30px;
  height: 30px;
}
</style>
