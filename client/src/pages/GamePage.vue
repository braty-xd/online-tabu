<template>
  <div v-if="!isLoading">
    <game-warning v-if="room.isGameInterrupted"></game-warning>
    <div
      class="container"
      style="background-color:#FFFFFF; border-style: solid;
  border-color: coral; border-width: 20px"
    >
      <div class="container">
        <p
          :class="{
            'text-danger': role === 'c',
            'text-success': role === 't',
            'text-primary': role === 'f',
          }"
          style="font-family: 'Secular One', sans-serif; font-size: 24px"
        >
          {{ mission }}
        </p>
      </div>
      <div class="container" style="">
        <div class="row" style="margin-bottom: 50px">
          <div class="col-2">
            <button
              style="width: 60%;"
              @click="
                socket.emit('toggle-time');
                timeToggleClicked();
              "
              class="btn btn-secondary"
              :disabled="role !== 't' || timeToggled"
            >
              <span v-if="room.isTimerOn" class="material-icons">
                pause
              </span>
              <span v-if="!room.isTimerOn" class="material-icons">
                play_arrow
              </span>
            </button>

            <button
              class="btn btn-secondary"
              style="width: 60%; margin-top: 100%"
              :disabled="role !== 't' || room.lastCard !== -1 || room.isNewTurn"
              @click="
                socket.emit(
                  'new-card',
                  currentTeam,
                  'b',
                  room.usedCards[room.usedCards.length - 2]
                )
              "
            >
              <span class="material-icons">
                settings_backup_restore
              </span>
            </button>
          </div>
          <div class="col">
            <taboo-card
              v-if="!isLoading && (role === 'c' || role === 't')"
              :tabooWord="tabooWord"
              :tabooRules="tabooRules"
              :role="role"
            ></taboo-card>
            <img
              v-if="!isLoading && role === 'f'"
              src="../assets/question.png"
              alt=""
            />
          </div>
          <div class="col-2">
            <div class="card">
              <div
                class="card-body"
                style="font-weight: normal; font-size: 36px; font-family: 'Secular One', sans-serif;"
              >
                {{ room.timer }}
              </div>
            </div>
            <button
              style="width: 60%; margin-top: 50%"
              @click="isSoundOn = !isSoundOn"
              class="btn btn-secondary"
              :class="{ disabled: !isSoundOn }"
            >
              <span v-if="isSoundOn" class="material-icons">
                volume_up
              </span>
              <span v-if="!isSoundOn" class="material-icons">
                volume_off
              </span>
            </button>
            <div style="margin-top: 50%">
              <button
                class="btn btn-info"
                style="width: 100%; font-family: 'Secular One', sans-serif;"
                @click="copyInvitation"
              >
                {{ invitationMessage }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- <button @click="socket.emit('toggle-time')">Toggle time</button> -->
      <div class="container" style="margin-bottom: 100px">
        <div
          class="row"
          style="text-align: center; margin-left: auto; margin-right: auto; width: 50%"
        >
          <div v-if="role === 't'" class="col">
            <button
              @click="
                socket.emit('new-card', currentTeam, 't');
                afterPress();
              "
              class="btn btn-danger"
              style="width:100px; font-family: 'Secular One', sans-serif;"
              :disabled="!room.isTimerOn || waitAfterPress"
            >
              Tabu
            </button>
          </div>
          <div v-if="role === 't'" class="col">
            <button
              @click="
                socket.emit('new-card', currentTeam, 'c');
                afterPress();
              "
              class="btn btn-success"
              style="width:100px; font-family: 'Secular One', sans-serif;"
              :disabled="!room.isTimerOn || waitAfterPress"
            >
              Doğru
            </button>
          </div>
          <div v-if="role === 't'" class="col">
            <button
              @click="
                socket.emit('new-card', currentTeam, 'p');
                afterPress();
              "
              class="btn btn-primary"
              style="width:100px; font-family: 'Secular One', sans-serif;"
              :disabled="
                room.passCount === 0 || !room.isTimerOn || waitAfterPress
              "
            >
              Pas
            </button>
          </div>
        </div>
        <div
          class="row"
          style="text-align: center; margin-left: auto; margin-right: auto; width: 30%; padding-top: 50px"
        >
          <div
            class="col"
            style="font-family: 'Secular One', sans-serif; font-size: 24px"
          >
            Takım {{ room.teamTurn }}: {{ printTeller }} anlatıyor
          </div>
        </div>
        <div class="row" style="font-family: 'Secular One', sans-serif;">
          <div class="col">Kalan Pas Hakkı: {{ room.passCount }}</div>
        </div>
      </div>
      <div class="container" style="">
        <div class="row">
          <div class="col">
            <team-members
              :members="room.team1"
              :teamNumber="1"
              :isMyTeamsTurn="room.teamTurn === 1"
              :tellerTurn="room[`overAllTurn${room.teamTurn}`]"
              :roomLeader="room.roomLeader"
            ></team-members>
          </div>
          <div class="col" style="font-family: 'Secular One', sans-serif;">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Takım 1</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-size: 36px">{{ room.team1Score }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col" style="font-family: 'Secular One', sans-serif;">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Takım 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-size: 36px">{{ room.team2Score }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col">
            <team-members
              :members="room.team2"
              :teamNumber="2"
              :isMyTeamsTurn="room.teamTurn === 2"
              :tellerTurn="room[`overAllTurn${room.teamTurn}`]"
              :roomLeader="room.roomLeader"
            ></team-members>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import GameEnd from "../components/GameEnd.vue";
import GameWarning from "../components/GameWarning.vue";
import TabooCard from "../components/TabooCard";
import TeamMembers from "../components/TeamMembers.vue";
export default {
  components: { TabooCard, TeamMembers, GameWarning },
  inject: ["socket", "backFromGame", "copy"],
  data() {
    return {
      tabooWord: null,
      tabooRules: null,
      isLoading: true,
      isTelling: false,
      role: null,
      mission: null,
      currentTeam: null,
      room: null,
      waitAfterPress: false,
      invitationMessage: "Arkadaşlarını Davet Et!",
      isSoundOn: true,
      timeToggled: false,
      roomId: null,
      goLobbyCount: 0,
    };
  },
  beforeRouteLeave(_to, _from, next) {
    let dene = confirm("oyundan ayrilmak uzeresin");
    if (dene) {
      this.backFromGame.isBack = true;
      if (this.goLobbyCount === 0) {
        console.log("before route leave calling delete player");
        this.socket.emit("delete-player", this.currentTeam);
        this.socket.emit(
          "delete-from-lobby",
          this.currentTeam,
          this.roomId,
          true
        );
      }
      this.goLobbyCount++;
      //this.socket.removeAllListeners();
      //this.socket.removeAllListeners(["delete-player"]);
      //this.socket.emit("remove-all-listeners");
      next(dene);
    } else {
      next(false);
    }
    //next(false);
  },
  created() {
    this.goLobbyCount = 0;
    this.roomId = this.$route.params.id;
    //console.log("before unload calling delete player")
    // window.addEventListener("beforeunload", () => {
    //   console.log("before unload calling delete player");
    //   this.socket.emit("delete-player", this.currentTeam);
    // });
    this.socket.emit("game-entered");
    this.socket.on("room-update", (room) => {
      this.room = room;
    });
    this.socket.on("time-update", (timer) => {
      this.room.timer = timer;
      //console.log(timer);
    });
    this.socket.on("room-start", (room) => {
      this.room = room;
      let isTeam2 = true;
      this.room.team1.forEach((player) => {
        if (Object.keys(player)[0] === this.socket.id) {
          this.currentTeam = 1;
          isTeam2 = false;
        }
      });
      if (isTeam2) {
        this.currentTeam = 2;
      }
      this.isLoading = false;
      if (this.currentTeam === this.room.teamTurn) {
        let myIndex = this.room[`team${this.currentTeam}`].findIndex(
          (player) => {
            return this.socket.id === Object.keys(player)[0];
          }
        );
        if (myIndex === this.room[`overAllTurn${this.currentTeam}`]) {
          this.socket.emit("new-card", this.currentTeam, "n");
        }
      }
    });
    this.socket.on("turn-ended", () => {
      if (this.currentTeam === this.room.teamTurn) {
        let myIndex = this.room[`team${this.currentTeam}`].findIndex(
          (player) => {
            return this.socket.id === Object.keys(player)[0];
          }
        );
        if (myIndex === this.room[`overAllTurn${this.currentTeam}`]) {
          this.socket.emit("new-card", this.currentTeam, "n");
        }
      }
    });
    this.socket.on("role-teller", (card) => {
      this.role = "t";
      this.mission = "Kelimeyi Anlat!";
      this.tabooWord = Object.keys(card)[0];
      this.tabooRules = card[Object.keys(card)[0]];
    });
    this.socket.on("role-finder", () => {
      this.role = "f";
      this.mission = "Kelimeyi Bul!";
      this.tabooWord = null;
      this.tabooRules = null;
    });
    this.socket.on("role-controller", (card) => {
      this.role = "c";
      this.mission = "Kelimeyi Kontrol et!";
      this.tabooWord = Object.keys(card)[0];
      this.tabooRules = card[Object.keys(card)[0]];
    });
    this.socket.on("play-sound", (action) => {
      if (this.isSoundOn) {
        let soundToPlay;
        switch (action) {
          case "correct":
            soundToPlay = new Audio(require("../assets/correct.mp3"));
            break;
          case "pass":
            soundToPlay = new Audio(require("../assets/pass.mp3"));
            break;
          case "taboo":
            soundToPlay = new Audio(require("../assets/taboo.mp3"));
            break;
          case "go-back":
            soundToPlay = new Audio(require("../assets/goback.mp3"));
            break;
          case "toggle-timer":
            soundToPlay = new Audio(require("../assets/toggle-timer.mp3"));
            break;
          case "turn-ended":
            soundToPlay = new Audio(require("../assets/alarm.mp3"));
            break;
          case "logout-game":
            soundToPlay = new Audio(require("../assets/user-logout.mp3"));
            break;
        }
        soundToPlay.play();
      }
    });
  },
  computed: {
    // roomId() {
    //   return this.$route.params.id;
    // },
    printTeller() {
      return Object.values(
        this.room[`team${this.room.teamTurn}`][
          this.room[`overAllTurn${this.room.teamTurn}`]
        ]
      )[0];
    },
  },
  methods: {
    copyInvitation() {
      this.copy(String(window.location.href).replace("game", "lobby"));
      this.invitationMessage = "Link panoya kopyalandı";
      setTimeout(() => {
        this.invitationMessage = "Arkadaşlarını Davet Et!";
      }, 3000);
    },
    afterPress() {
      this.waitAfterPress = true;
      setTimeout(() => {
        this.waitAfterPress = false;
      }, 500);
    },
    timeToggleClicked() {
      this.timeToggled = true;
      setTimeout(() => {
        this.timeToggled = false;
      }, 500);
    },
  },
  // methods: {
  //   printTeller() {
  //     return Object.values(
  //       this.room[`team${this.room.teamTurn}`][
  //         this.room[`overAllTurn${this.room.teamTurn}`]
  //       ]
  //     )[0];
  //   },
  // },
};
</script>

<style scoped>
/* Adding transformation when the button is active */

.btn:active:not([disabled]) {
  transform: scale(0.98);
  /* Scaling button to 0.98 to its original size */
  box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
  /* Lowering the shadow */
}

/* fallback */
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/materialicons/v76/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2)
    format("woff2");
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 36px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  /* font-feature-settings: "liga"; */
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}

@import url("https://fonts.googleapis.com/css2?family=Secular+One&display=swap");
</style>
