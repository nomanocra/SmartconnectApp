<template>
  <div class="skeleton-rectangle"></div>
</template>

<script setup></script>

<style scoped>
.skeleton-rectangle {
  padding: 0.25rem;
  background-color: color-mix(in srgb, var(--p-background-lvl4) 50%, transparent);
  border-radius: 4px;
  overflow: hidden;
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--p-background-lvl0) 70%, transparent) 30%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  /* pulsate 2s ease-in-out infinite; */
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
/*
@keyframes pulsate {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
} */
</style>
