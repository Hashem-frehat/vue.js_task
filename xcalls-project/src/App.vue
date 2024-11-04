<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-md mx-auto p-4">
 
      <div
        :class="[
          'p-2 mb-4 rounded-full text-center text-sm',
          connectionStatusClass,
        ]"
      >
        {{ connectionStatus }}
      </div>

      <div class="bg-white rounded-3xl shadow-xl p-6">
    
        <OutboundCall
          :isConnected="isConnected"
          @make-call="handleOutboundCall"
        />

     
        <InboundCall
          v-if="currentIncomingCall"
          :currentCall="currentIncomingCall"
          @answer-call="handleAnswerCall"
          @reject-call="handleRejectCall"
          class="mt-6"
        />

      
        <CallSummary
          v-if="lastCallSummary"
          :summary="lastCallSummary"
          class="mt-6"
        />

        
        <CallLog :calls="callLogs" class="mt-6" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { SipService } from './services/sip.service'
import OutboundCall from './components/OutboundCall.vue'
import InboundCall from './components/InboundCall.vue'
import CallSummary from './components/CallSummary.vue'
import CallLog from './components/CallLog.vue'

export default {
  name: 'App',
  components: {
    OutboundCall,
    InboundCall,
    CallSummary,
    CallLog,
  },

  setup() {
    const sipService = new SipService()
    const isConnected = ref(false)
    const connectionStatus = ref('Connecting...')
    const currentIncomingCall = ref(null)
    const currentCall = ref(null)
    const lastCallSummary = ref(null)
    const callLogs = ref([])

    const connectionStatusClass = computed(() => {
      return isConnected.value
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
    })

 
    onMounted(async () => {
      try {
        await sipService.initialize()
        isConnected.value = true
        connectionStatus.value = 'Successfully Connected'

        // Register event handlers
        sipService.setCallbacks({
          onIncomingCall: session => {
            currentIncomingCall.value = session
          },
        })
      } catch (error) {
        connectionStatus.value = 'Connection Failed'
        console.error('Initialization Error:', error)
      }
    })


    onBeforeUnmount(async () => {
      await sipService.disconnect()
    })

    const handleOutboundCall = async phoneNumber => {
      try {
        currentCall.value = await sipService.makeCall(phoneNumber)
        const startTime = new Date()

        currentCall.value.stateChange.addListener(state => {
          if (state === 'terminated') {
            createCallSummary(startTime, new Date(), 'outbound', 'completed')
            currentCall.value = null // Reset currentCall after call ends
          }
        })
      } catch (error) {
        console.error('Error making call:', error)
        createCallSummary(new Date(), new Date(), 'outbound', 'failed')
      }
    }

    const handleAnswerCall = async () => {
      if (!currentIncomingCall.value) return

      try {
        const startTime = new Date()
        await sipService.answerCall(currentIncomingCall.value)

        currentIncomingCall.value.stateChange.addListener(state => {
          if (state === 'terminated') {
            createCallSummary(startTime, new Date(), 'inbound', 'completed')
            currentIncomingCall.value = null // Reset after call ends
          }
        })
      } catch (error) {
        console.error('Error answering call:', error)
        createCallSummary(new Date(), new Date(), 'inbound', 'failed')
      }
    }

    const handleRejectCall = async () => {
      if (!currentIncomingCall.value) return

      try {
        await sipService.rejectCall(currentIncomingCall.value)
        createCallSummary(new Date(), new Date(), 'inbound', 'rejected')
      } catch (error) {
        console.error('Error rejecting call:', error)
      } finally {
        currentIncomingCall.value = null
      }
    }

    const createCallSummary = (startTime, endTime, type, status) => {
      const duration = Math.floor((endTime - startTime) / 1000)
      const summary = {
        startTime,
        endTime,
        duration,
        type,
        status,
      }

      lastCallSummary.value = summary
      callLogs.value.unshift(summary)
    }

    return {
      isConnected,
      connectionStatus,
      connectionStatusClass,
      currentIncomingCall,
      lastCallSummary,
      callLogs,
      handleOutboundCall,
      handleAnswerCall,
      handleRejectCall,
    }
  },
}
</script>
