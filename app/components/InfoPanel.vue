<template>
  <Transition name="panel">
    <div
      v-if="landmark"
      class="info-panel"
      :class="{ 'has-link': !!landmark.url }"
      role="status"
      :aria-label="landmark.name"
    >
      <p class="landmark-label">Lutheran Land</p>
      <h2>{{ landmark.name }}</h2>
      <p class="description">{{ landmark.description }}</p>
      <p class="content">{{ landmark.content }}</p>
      <p v-if="landmark.url" class="enter-hint">↵</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Landmark {
  id: string
  name: string
  description: string
  content: string
  url?: string
}

defineProps<{
  landmark: Landmark | null
}>()
</script>

<style scoped>
.info-panel {
  position: fixed;
  bottom: 1.75rem;
  left: 1.75rem;
  z-index: 70;
  width: 300px;
  max-width: calc(100vw - 3.5rem);
  background: rgba(26, 20, 16, 0.88);
  border: 1px solid rgba(232, 213, 183, 0.18);
  border-radius: 6px;
  color: #e8d5b7;
  padding: 1.125rem 1.375rem 1.25rem;
  backdrop-filter: blur(10px);
  pointer-events: none;
}

.info-panel.has-link {
  border-color: rgba(232, 213, 183, 0.55);
}

.landmark-label {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.4;
  margin: 0 0 0.375rem;
}

h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  letter-spacing: 0.02em;
}

.description {
  font-size: 0.8125rem;
  opacity: 0.5;
  margin: 0 0 0.75rem;
  font-style: italic;
}

.content {
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  opacity: 0.82;
}

.enter-hint {
  margin: 0.75rem 0 0;
  text-align: right;
  font-size: 0.75rem;
  opacity: 0.35;
  letter-spacing: 0.05em;
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}
</style>
