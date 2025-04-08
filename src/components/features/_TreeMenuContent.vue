<template>
  <div v-if="status === 'loaded'" class="tree-menu">
    <template v-for="node in data" :key="node.id">
      <TreeLeaf
        v-if="!node.children"
        :label="node.label"
        :id="node.id"
        :selected="selectedId === node.id"
        @click="handleLeafSelected(node.id)"
      />
      <TreeNode v-else :label="node.label" :id="node.id">
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
    <TreeNodeSkeleton v-for="i in 3" :key="i" />
  </div>
  <div v-else-if="status === 'error'">Sorry, an error occurred while loading the data.</div>
</template>

<script setup>
import TreeNode from '@/components/base/TreeNode.vue'
import TreeLeaf from '@/components/base/TreeLeaf.vue'
import TreeMenuContent from '@/components/features/_TreeMenuContent.vue'
import TreeNodeSkeleton from '@/components/base/TreeNodeSkeleton.vue'
import { defineEmits, onMounted } from 'vue'

const props = defineProps({
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

onMounted(() => {
  console.log('TreeMenuContent selectedId', props.selectedId)
})
const emit = defineEmits(['leaf-selected'])

const handleLeafSelected = (leafId) => {
  emit('leaf-selected', leafId)
}
</script>

<style scoped>
.tree-menu {
  display: flex;
  flex-direction: column;
}
.tree-menu-loading {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
