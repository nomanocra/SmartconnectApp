<template>
  <TreeMenuContent
    :data="props.treeData"
    :selected-id="props.selectedId"
    @leaf-selected="handleLeafSelected"
    :status="props.status"
  />
</template>

<script setup>
import TreeMenuContent from '@/components/features/_TreeMenuContent.vue'

const props = defineProps({
  selectedId: {
    type: [String, Number],
    default: null,
  },
  treeData: {
    type: Array,
    default: () => [],
  },
  status: {
    type: String,
    default: 'loading',
  },
})

const emit = defineEmits(['leaf-selected'])

function handleLeafSelected(leafId, leafName) {
  emit('leaf-selected', leafId, leafName)
}
</script>
