import cards from "./pages/cards.vue";
import index from "./pages/index.vue";
import game from "./pages/game.vue";
import join from "./pages/join.vue";
import create from "./pages/create.vue";
import room from "./pages/room.vue";
import rules from "./pages/rules.vue";

export default [
  { path: "/cards", component: cards },
  { path: "/", component: index },
  { path: "/game", component: game },
  { path: "/join", component: join },
  { path: "/create", component: create },
  { path: "/room", component: room },
  { path: "/rules", component: rules }
];
