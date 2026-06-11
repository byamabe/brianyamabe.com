<template>
  <div class="layout">
    <button
      class="menu-toggle"
      :class="{ open: menuOpen }"
      :aria-expanded="menuOpen"
      aria-label="Toggle navigation"
      @click="menuOpen = !menuOpen"
    >
      <span /><span /><span />
    </button>

    <Transition name="menu">
      <nav v-if="menuOpen" class="global-menu" aria-label="Site navigation">
        <div class="menu-header">
          <h1>Brian Yamabe</h1>
          <p>山辺ブライアン</p>
        </div>
        <ul>
          <li v-for="item in nav" :key="item.to">
            <NuxtLink :to="item.to" @click="menuOpen = false">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>

    <div
      v-if="menuOpen"
      class="menu-overlay"
      @click="menuOpen = false"
    />

    <slot />
  </div>
</template>

<script setup lang="ts">
const menuOpen = ref(false)

const nav = [
  { to: '/', label: 'The World' },
  { to: '/lutheran', label: 'Lutheran' },
  { to: '/japanese', label: 'Japanese' },
  { to: '/software', label: 'Software' },
  { to: '/lutheran-media', label: 'Lutheran Media' },
  { to: '/disney', label: 'Walt Disney' },
]
</script>

<style scoped>
.layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a1410;
}

/* Menu toggle button — top-right corner */
.menu-toggle {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 100;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(26, 20, 16, 0.8);
  border: 1px solid rgba(232, 213, 183, 0.3);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0;
  backdrop-filter: blur(4px);
}

.menu-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  background: #e8d5b7;
  transition: transform 0.25s, opacity 0.25s;
  transform-origin: center;
}

.menu-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.menu-toggle.open span:nth-child(2) { opacity: 0; }
.menu-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Slide-out panel */
.global-menu {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 90;
  width: min(320px, 85vw);
  height: 100vh;
  background: #1a1410;
  border-left: 1px solid rgba(232, 213, 183, 0.15);
  padding: 2rem 1.5rem;
  overflow-y: auto;
  color: #e8d5b7;
}

.menu-header {
  padding: 1rem 0 2rem;
  border-bottom: 1px solid rgba(232, 213, 183, 0.15);
  margin-bottom: 1.5rem;
}

.menu-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  letter-spacing: 0.05em;
}

.menu-header p {
  font-size: 0.875rem;
  opacity: 0.5;
  margin: 0;
}

.global-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.global-menu a {
  display: block;
  padding: 0.625rem 0.75rem;
  color: #e8d5b7;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background 0.15s;
}

.global-menu a:hover,
.global-menu a.router-link-active {
  background: rgba(232, 213, 183, 0.1);
}

/* Overlay */
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(0, 0, 0, 0.5);
}

/* Transition */
.menu-enter-active,
.menu-leave-active {
  transition: transform 0.3s ease;
}
.menu-enter-from,
.menu-leave-to {
  transform: translateX(100%);
}
</style>
