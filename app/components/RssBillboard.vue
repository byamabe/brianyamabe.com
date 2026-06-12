<template>
  <div class="rss-billboard" role="complementary" aria-label="Synod Stories feed">
    <p class="land-label">Lutheran Media</p>
    <h2>Synod Stories</h2>
    <div v-if="pending" class="feed-state">Loading episodes…</div>
    <div v-else-if="!data?.length" class="feed-state">No episodes available</div>
    <ul v-else class="episode-list">
      <li v-for="item in data.slice(0, 6)" :key="item.id">
        <a :href="item.url" target="_blank" rel="noopener" class="episode-link">
          <span class="episode-title">{{ item.title }}</span>
          <span class="episode-date">{{ formatDate(item.date) }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { data, pending } = useFetch('/api/synod-stories', { server: false })

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.rss-billboard {
  position: fixed;
  bottom: 1.75rem;
  left: 1.75rem;
  z-index: 70;
  width: 340px;
  max-width: calc(100vw - 3.5rem);
  background: rgba(26, 20, 16, 0.88);
  border: 1px solid rgba(232, 213, 183, 0.18);
  border-radius: 6px;
  color: #e8d5b7;
  padding: 1.125rem 1.375rem 1.25rem;
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

.land-label {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.4;
  margin: 0 0 0.375rem;
}

h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.875rem;
  letter-spacing: 0.02em;
}

.feed-state {
  font-size: 0.875rem;
  opacity: 0.45;
  font-style: italic;
}

.episode-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.episode-link {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-decoration: none;
  color: inherit;
  padding: 0.375rem 0;
  border-bottom: 1px solid rgba(232, 213, 183, 0.08);
  transition: opacity 0.15s;
}

.episode-link:hover {
  opacity: 0.7;
}

.episode-title {
  font-size: 0.875rem;
  line-height: 1.45;
  opacity: 0.88;
}

.episode-date {
  font-size: 0.7rem;
  opacity: 0.38;
  letter-spacing: 0.04em;
}
</style>
