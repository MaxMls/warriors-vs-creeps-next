import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
//import routes from "virtual:generated-pages";
import routes from "./routes";
import App from "./App.vue";
import "virtual:svg-icons-register";
import { createI18n } from "vue-i18n";

import ru from "./locales/ru.json";
import ja from "./locales/ja.json";
import en from "./locales/en.json";
import de from "./locales/de.json";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
 // routes
 routes
});

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("lang") || "ru",
  fallbackLocale: "en",
  // @ts-ignore
  messages: { ru, ja, en, de }
});

const app = createApp(App);

app.use(router);
app.use(i18n);

app.mount("#app");
