<template>
  <teleport to="body">
    <div></div>
    <dialog open>
      <header>
        <h2>
          OYUN SONA ERDİ!
        </h2>
      </header>
      <section>
        <p>
          Oyuna devam edebilmek için her takımda en az iki oyuncu olması
          gerekmektedir
        </p>
        <p>
          Oyuna arkadaşlarınızı çağırarak gereken kişi sayısına ulaşabilirsiniz
        </p>
      </section>
      <menu>
        <button class="btn btn-info" @click="goBackToLobby">
          Lobiye Dön
        </button>
      </menu>
    </dialog>
  </teleport>
</template>

<script>
export default {
  methods: {
    goBackToLobby() {},
  },
};
</script>
