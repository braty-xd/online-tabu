<template>
  <div>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
//import MainPage from "./pages/MainPage.vue";
//import LobbyPage from "./pages/LobbyPage.vue";
import { io } from "socket.io-client";
export default {
  name: "App",
  components: {
    //LobbyPage,
    //MainPage,
  },
  provide: {
    socket: io("192.168.1.107:3000"),
    copy: require("clipboard-copy"),
    backFromGame: { isBack: false, backFromLobby: false },
    ///allowLeave: {isAllowed:false}
  },

  created() {
    window.addEventListener("beforeunload", () => {
      alert("bb");
      this.socket.close();
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  /* background-image: url("https://images.wallpaperscraft.com/image/city_buildings_silhouettes_198916_1920x1080.jpg"); */
  /* background-image: url("https://images.wallpaperscraft.com/image/paint_stains_liquid_198902_1920x1080.jpg"); */
  /* background-image: url("./assets/taborep.jpeg"); */
  background-image: url("https://images.wallpaperscraft.com/image/lines_colorful_pattern_130007_3840x2160.jpg");
}
@import url("https://fonts.googleapis.com/css2?family=Secular+One&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Ultra&display=swap");
</style>
