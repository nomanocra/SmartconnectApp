<template>
  <Splitter class="monitoring-tab" :gutterSize="2">
    <SplitterPanel class="gateways-pane" :size="25">
      <h5>GATEWAYS</h5>
    </SplitterPanel>
    <SplitterPanel class="dashboard-pane" :size="75">
      <h1>Building B02</h1>
    </SplitterPanel>
  </Splitter>
</template>

<script setup>
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
</script>

<style scoped>
.monitoring-tab {
  height: 100%;
  width: 100%;
}

.gateways-pane {
  background-color: var(--p-background-lvl0);
  max-width: 300px;
  min-width: 160px;
  padding: var(--size-content-padding);
  color: var(--p-text-secondary-color);
}

.dashboard-pane {
  background-color: var(--p-background-lvl0);
  padding: var(--size-content-padding-xl);
}

.p-splitter-gutter-handle {
  width: 1px !important;
}
</style>
