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
const selectedName = ref(null)
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

const emit = defineEmits(['leaf-selected'])

// Watch for status changes to update selectedId when data is loaded
watch(
  () => props.status,
  (newStatus) => {
    if (newStatus === 'loaded' && props.data.length > 0) {
      const { id, name } = findFirstLeafId(props.data)
      selectedId.value = id
      selectedName.value = name
      emit('leaf-selected', id, name)
    }
  },
  { immediate: true },
)

function handleLeafSelected(leafId, leafName) {
  selectedId.value = leafId
  emit('leaf-selected', leafId, leafName)
}

// Si vous voulez sélectionner le premier élément au chargement
function findFirstLeafId(nodes) {
  for (const node of nodes) {
    if (!node.children) {
      return { id: node.id, name: node.name }
    }
    if (node.children) {
      return findFirstLeafId(node.children)
    }
  }
  return null
}
</script>
