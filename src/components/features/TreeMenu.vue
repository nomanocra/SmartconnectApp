<template>
  <TreeMenuContent
    :data="props.data"
    :selected-id="selectedId"
    @leaf-selected="handleLeafSelected"
    :status="props.status"
  />
</template>

<script setup>
import TreeMenuContent from '@/components/features/_TreeMenuContent.vue'
import { ref, watch } from 'vue'

const selectedId = ref(null)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    required: false,
    default: 'loaded',
  },
})

// Watch for status changes to update selectedId when data is loaded
watch(
  () => props.status,
  (newStatus) => {
    if (newStatus === 'loaded' && props.data.length > 0) {
      selectedId.value = findFirstLeafId(props.data)
    }
  },
  { immediate: true },
)

function handleLeafSelected(leafId) {
  selectedId.value = leafId
}

// Si vous voulez sélectionner le premier élément au chargement
function findFirstLeafId(nodes) {
  for (const node of nodes) {
    if (!node.children) {
      return node.id
    }
    if (node.children) {
      return findFirstLeafId(node.children)
    }
  }
  return null
}
</script>
