<template>
  <div class="monitoring-navigation">
    <div class="monitoring-navigation-header">
      <h4>Monitoring</h4>
      <div class="action-buttons">
        <Button
          icon="pi pi-plus"
          text
          size="small"
          v-tooltip.bottom="$t('pages.dashboard.addDevice')"
        />
        <Button
          icon="pi pi-folder-plus"
          text
          size="small"
          v-tooltip.bottom="$t('pages.dashboard.addGroup')"
        />
      </div>
    </div>
    <div class="tree-menu">
      <TreeNode label="Toulouse" id="2">
        <TreeLeaf label="Devices" id="1" />
        <TreeLeaf label="Devices" id="1" />
        <TreeLeaf label="Devices" id="1" />
        <TreeLeaf label="Devices" id="1" />
      </TreeNode>
      <TreeNode label="Paris" id="2">
        <TreeLeaf label="Devices" id="1" />
        <TreeNode label="Building1" id="2">
          <TreeLeaf label="Devices" id="1" />
          <TreeLeaf label="Devices" id="1" />
          <TreeLeaf label="Devices" id="1" />
          <TreeLeaf label="Devices" id="1" />
        </TreeNode>
      </TreeNode>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NodeService } from '@/utils/NodeService.js'
import Button from 'primevue/button'
import TreeLeaf from '@/components/base/TreeLeaf.vue'
import TreeNode from '@/components/base/TreeNode.vue'

const nodes = ref([])
onMounted(() => {
  NodeService.getTreeNodes().then((data) => (nodes.value = data))
})
</script>

<style scoped>
.monitoring-navigation {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  background-color: var(--p-background-lvl0);
  width: 300px;
  padding: var(--size-content-padding);
  color: var(--p-text-secondary-color);
}

.monitoring-navigation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 0.125rem;
}

.tree-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
