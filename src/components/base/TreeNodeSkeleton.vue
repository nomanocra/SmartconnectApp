<template>
  <div class="tree-node-skeleton"></div>
</template>

<script setup></script>

<style scoped>
.tree-node-skeleton {
  width: 100%;
  height: 36px;
  background-color: var(--p-background-lvl2);
  border-radius: 4px;
  overflow: hidden;
  background-image: linear-gradient(45deg, transparent, var(--p-background-lvl3), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
