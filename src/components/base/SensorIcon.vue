<template>
  <div>
    <PhThermometer v-if="icon === 'temperature'" :size="size" />
    <PhHardDrive v-else-if="icon === 'hard-drive'" :size="size" />
    <PhLightbulb v-else-if="icon === 'lightbulb'" :size="size" />
    <PhWind v-else-if="icon === 'wind' || icon === 'airflow'" :size="size" />
    <PhDrop v-else-if="icon === 'humidity'" :size="size" />
    <PhCloud v-else-if="icon === 'co2'" :size="size" />
    <PhAtom v-else-if="icon === 'particulate'" :size="size" />
    <PhDoor v-else-if="icon === 'door'" :size="size" />
    <PhUsers v-else-if="icon === 'occupancy'" :size="size" />
    <PhSneakerMove v-else-if="icon === 'movement'" :size="size" />
    <PhFlame v-else-if="icon === 'smoke'" :size="size" />
    <PhGauge v-else-if="icon === 'pressure'" :size="size" />
    <PhSpeakerHigh v-else-if="icon === 'noise'" :size="size" />
    <PhFan v-else-if="icon === 'fan'" :size="size" />
    <PhWaves v-else-if="icon === 'wave'" :size="size" />
    <PhSunDim v-else-if="icon === 'uv'" :size="size" />
    <PhCirclesThree v-else-if="icon === 'oxygen'" :size="size" />
    <PhBroadcast v-else :size="size" />
  </div>
</template>

<script setup>
import { PhThermometer } from '@phosphor-icons/vue'
import { PhHardDrive } from '@phosphor-icons/vue'
import { PhLightbulb } from '@phosphor-icons/vue'
import { PhWind } from '@phosphor-icons/vue'
import { PhDrop } from '@phosphor-icons/vue'
import { PhCloud } from '@phosphor-icons/vue'
import { PhAtom } from '@phosphor-icons/vue'
import { PhDoor } from '@phosphor-icons/vue'
import { PhUsers } from '@phosphor-icons/vue'
import { PhSneakerMove } from '@phosphor-icons/vue'
import { PhFlame } from '@phosphor-icons/vue'
import { PhGauge } from '@phosphor-icons/vue'
import { PhSpeakerHigh } from '@phosphor-icons/vue'
import { PhFan } from '@phosphor-icons/vue'
import { PhWaves } from '@phosphor-icons/vue'
import { PhSunDim } from '@phosphor-icons/vue'
import { PhBroadcast } from '@phosphor-icons/vue'
import { PhCirclesThree } from '@phosphor-icons/vue'
defineProps({
  icon: {
    type: String,
    required: true,
    default: 'thermometer',
  },
  size: {
    type: Number,
    default: 20,
  },
})
</script>

<style scoped></style>
