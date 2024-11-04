<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Call Log</h2>

    <div class="space-y-4">
      <div v-for="(call, index) in calls" :key="index" class="border-b pb-2">
        <div>
          <span class="font-medium">Date:</span>
          {{ formatDate(call.startTime) }}
        </div>

        <div>
          <span class="font-medium">Duration:</span>
          {{ formatDuration(call.duration) }}
        </div>

        <div>
          <span class="font-medium">Type:</span>
          {{ getCallType(call.type) }}
        </div>

        <div>
          <span class="font-medium">Status:</span>
          {{ getCallStatus(call.status) }}
        </div>
      </div>
    </div>

    <div v-if="!calls.length" class="text-center text-gray-500">
      No calls in the log
    </div>
  </div>
</template>

<script>
export default {
  name: 'CallLog',

  props: {
    calls: {
      type: Array,
      required: true,
    },
  },

  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString()
    },

    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    },

    getCallType(type) {
      const types = {
        inbound: 'Incoming',
        outbound: 'Outgoing',
        rejected: 'Rejected',
      }
      return types[type] || type
    },

    getCallStatus(status) {
      const statuses = {
        completed: 'Completed',
        rejected: 'Rejected',
      }
      return statuses[status] || status
    },
  },
}
</script>
