<template>
  <div
    v-if="currentCall"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-3xl p-6 w-full max-w-sm mx-4">
      <div class="text-center space-y-4">
        <div class="text-6xl mb-4">📞</div>
        <h2 class="text-xl font-semibold">
          Incoming Call from
          {{ formatPhoneNumber(currentCall.remoteIdentity.uri.user) }}
        </h2>

        <div class="flex justify-center gap-4 mt-6">
          <button
            @click="answerCall"
            class="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
          >
            <span class="text-white text-3xl">✓</span>
          </button>

          <button
            @click="rejectCall"
            class="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <span class="text-white text-3xl">✕</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InboundCall',
  props: {
    currentCall: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatPhoneNumber(number) {
      return number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    },
    answerCall() {
      this.$emit('answer-call')
    },
    rejectCall() {
      this.$emit('reject-call')
    },
  },
}
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
