<template>
  <div v-if="status === 'loaded'" class="tree-menu-content">
    <template v-for="node in data" :key="node.id">
      <TreeLeaf
        v-if="!node.children"
        :label="node.name"
        :id="node.id"
        :selected="selectedId === node.id"
        @click="handleLeafSelected(node.id, node.name)"
      />
      <TreeNode v-else :label="node.name" :id="node.id">
        <TreeMenuContent
          :data="node.children"
          :selected-id="selectedId"
          @leaf-selected="handleLeafSelected"
          :status="status"
        />
      </TreeNode>
    </template>
  </div>
  <div v-else-if="status === 'loading'" class="tree-menu-loading">
    <SkeletonRectangle v-for="i in 3" :key="i" />
  </div>
  <div v-else-if="status === 'error'">
    {{ $t('errors.error') }}
  </div>
</template>

<script setup>
import TreeNode from '@/components/base/TreeNode.vue'
import TreeLeaf from '@/components/base/TreeLeaf.vue'
import TreeMenuContent from '@/components/features/_TreeMenuContent.vue'
import SkeletonRectangle from '@/components/base/SkeletonRectangle.vue'
import { defineEmits } from 'vue'

defineProps({
  data: {
    type: Array,
    required: true,
  },
  selectedId: {
    type: [String, Number],
    default: null,
  },
  status: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['leaf-selected'])

const handleLeafSelected = (leafId, leafName) => {
  emit('leaf-selected', leafId, leafName)
}
</script>

<style scoped>
.tree-menu-content {
  display: flex;
  flex-direction: column;
}
.tree-menu-loading {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.skeleton-rectangle {
  width: 100%;
  height: 36px;
}
</style>
