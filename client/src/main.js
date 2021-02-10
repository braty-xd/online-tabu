import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

import MainPage from "./pages/MainPage.vue";
import LobbyPage from "./pages/LobbyPage.vue";
import GamePage from "./pages/GamePage.vue";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: MainPage, name: "Root" },
    { path: "/lobby/:id", component: LobbyPage, name: "Lobby" },
    { path: "/game/:id", component: GamePage, name: "Game" },
    { path: "/:notFound(.*)", redirect: { name: "Root" } },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
