<style>
.main {
  display: block;
  padding: 0 60px;
}

.main h1 {
  margin: 0;
  margin-bottom: 50px;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: inline-block;
}

.main .content {
  display: flex;
}

@media screen and (min-width: 1921px) {
  .main {
    width: 1920px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 1366px),
(max-height: 768px) {
  .main h1 {
    font-size: 36px;
  }
}

@media screen and (max-width: 1152px),
(max-height: 727px) {
  .main h1 {
    margin-bottom: 35px;
  }
}

@media screen and (max-width: 800px),
(max-height: 600px) {
  .main {
    padding: 0 30px;
  }

  .main h1 {
    font-size: 30px;
    margin-bottom: 30px;
  }
}

.main-t-enter-active,
.main-t-leave-active {
  transition: opacity .65s;
}

.main-t-enter,
.main-t-leave-to {
  opacity: 0;
}
</style>

<template>
  <section class="main"> 
    <transition name="main-t" mode="out-in">
      <router-view />
    </transition>
  </section>
</template>