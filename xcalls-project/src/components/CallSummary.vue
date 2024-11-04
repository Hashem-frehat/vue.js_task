<template>
  <div class="border-t pt-4">
    <h2 class="text-lg font-semibold mb-4">Last Call</h2>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-600">Time:</span>
        <span>{{ formatDate(summary.startTime) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Duration:</span>
        <span>{{ formatDuration(summary.duration) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Type:</span>
        <span>{{ getCallType(summary.type) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Status:</span>
        <span>{{ getCallStatus(summary.status) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { callUtils } from '../utils/call.utils'

export default {
  name: 'CallSummary',
  props: {
    summary: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      return callUtils.formatDate(date) // Formats the call start time
    },
    formatDuration(seconds) {
      return callUtils.formatDuration(seconds) // Converts seconds to a readable duration
    },
    getCallType(type) {
      return callUtils.getCallType(type) // Determines the call type (e.g., incoming, outgoing)
    },
    getCallStatus(status) {
      return callUtils.getCallStatus(status) // Provides call status (e.g., completed, missed)
    },
  },
}
</script>
