<template>
  <div class="world-page">
    <!-- 3D World — desktop only -->
    <canvas v-if="!isMobile" ref="canvas" class="world-canvas" />

    <!-- Mobile fallback — direct to Global Menu content -->
    <div v-else class="mobile-notice">
      <h2>Brian Yamabe</h2>
      <p>山辺ブライアン</p>
      <p class="sub">The 3D world requires a desktop browser.<br>Use the menu to explore.</p>
      <p class="hint">Tap ☰ in the top right to navigate.</p>
    </div>

    <InfoPanel :landmark="activeLandmark" />
  </div>
</template>

<script setup lang="ts">
import { useThreeWorld } from '~/composables/useThreeWorld'
import lutheranData from '~~/content/landmarks/lutheran.json'

const canvas = ref<HTMLCanvasElement | null>(null)
const isMobile = ref(false)
const activeLandmarkId = ref<string | null>(null)

const activeLandmark = computed(
  () => lutheranData.landmarks.find(l => l.id === activeLandmarkId.value) ?? null,
)

function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Enter') return
  const url = activeLandmark.value?.url
  if (!url) return
  if (url.startsWith('http')) {
    window.open(url, '_blank', 'noopener')
  }
  else {
    navigateTo(url)
  }
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  if (!isMobile.value && canvas.value) {
    const { dispose } = useThreeWorld(canvas.value, activeLandmarkId)
    onUnmounted(dispose)
  }

  window.addEventListener('keydown', onKeyDown)
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
})
</script>

<style scoped>
.world-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.world-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.mobile-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #e8d5b7;
  text-align: center;
  padding: 2rem;
  gap: 0.5rem;
}

.mobile-notice h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.mobile-notice p {
  margin: 0;
  opacity: 0.7;
}

.mobile-notice .sub {
  margin-top: 1rem;
  line-height: 1.6;
}

.mobile-notice .hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.5;
}
</style>
