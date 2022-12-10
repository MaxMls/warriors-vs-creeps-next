import cards from "./pages/cards.vue";
import index from "./pages/index.vue";
import game from "./pages/game.vue";
import join from "./pages/join.vue";
import create from "./pages/create.vue";
import room from "./pages/room.vue";
import rules from "./pages/rules.vue";
import svgspritetestVue from "./pages/webtrctest/svgspritetest.vue";
import allcards from "./pages/webtrctest/allcards.vue";

export default [
  { path: "/cards", component: cards },
  { path: "/", component: index },
  { path: "/game", component: game },
  { path: "/join", component: join },
  { path: "/create", component: create },
  { path: "/room", component: room },
  { path: "/rules", component: rules },
  { path: "/webtrctest/svgspritetest", component: svgspritetestVue },
  { path: "/webtrctest/allcards", component: allcards }
];
