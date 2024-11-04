<template>
  <div class="p-6 bg-white rounded-lg shadow-md max-w-xs mx-auto">
    <div class="text-center mb-6">
      <input
        v-model="phoneNumber"
        type="tel"
        placeholder="Enter Phone Number"
        class="text-4xl font-mono text-center w-full bg-transparent focus:outline-none border-b-2 border-gray-300"
        :disabled="!isConnected"
        readonly
      />
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
      <button
        v-for="num in [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '*',
          '0',
          '#',
        ]"
        :key="num"
        @click="appendNumber(num)"
        class="aspect-square rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-3xl font-bold flex items-center justify-center transition-colors"
        :disabled="!isConnected"
        style="height: 70px; width: 70px"
      >
        {{ num }}
      </button>
    </div>

    <div class="flex justify-center gap-4 mb-6">
      <button
        @click="makeCall"
        :disabled="!canMakeCall"
        class="w-16 h-16 rounded-full flex items-center justify-center transition-colors"
        :class="canMakeCall ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'"
      >
        <span class="text-white text-2xl">📞</span>
      </button>

      <button
        @click="clearNumber"
        class="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
      >
        <span class="text-white text-2xl">⌫</span>
      </button>
    </div>

    <div v-if="error" class="mt-4 text-red-500 text-center text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
export default {
  name: 'OutboundCall',
  props: {
    isConnected: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      phoneNumber: '',
      error: '',
    }
  },
  computed: {
    canMakeCall() {
      return this.isConnected && this.phoneNumber.length > 0
    },
  },
  methods: {
    appendNumber(num) {
      this.phoneNumber += num
    },
    clearNumber() {
      if (this.phoneNumber.length > 0) {
        this.phoneNumber = this.phoneNumber.slice(0, -1)
      }
    },
    makeCall() {
      if (!this.canMakeCall) return
      this.error = ''
      this.$emit('make-call', this.phoneNumber)
    },
  },
}
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
