import { Web } from 'sip.js'

export class SipService {
  constructor() {
    this.userAgent = null
    this.session = null
    this.callbacks = {}
    this.inputError = ''
    this.destinationNumber = ''
    this.isConnected = false
    this.debugInfo = ''
  }

  async initialize() {
    const sipConfig = {
      uri: 'sip:101@sip.xtrevo.com', // Directly use the URI as a string
      transportOptions: {
        wsServers: ['wss://sip.xtrevo.com:8443/asterisk-wss'],
        traceSip: true,
      },
      authorizationUsername: import.meta.env.VITE_SIP_USERNAME,
      authorizationPassword: import.meta.env.VITE_SIP_PASSWORD,
      displayName: '101',
      sessionDescriptionHandlerFactoryOptions: {
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
        constraints: {
          audio: true,
          video: false,
        },
      },
      registerExpires: 300,
    }

    try {
     
      this.userAgent = new Web.SimpleUser(
        'wss://sip.xtrevo.com:8443/asterisk-wss',
        sipConfig,
      )


      await this.userAgent.connect()
      await this.userAgent.register()


      this.userAgent.delegate = {
        onIncomingCall: session => {
          console.log('Incoming call received.')
          this.session = session
          this.callbacks.onIncomingCall?.(session)
        },
      }

      console.log('SIP initialized successfully')
      console.log('SIP Username:', import.meta.env.VITE_SIP_USERNAME)
      console.log('SIP Password:', import.meta.env.VITE_SIP_PASSWORD)
      this.isConnected = true 
      this.debugInfo = 'SIP client initialized successfully'
      return true
    } catch (error) {
      console.error('Error initializing SIP:', error)
      this.debugInfo = `Failed to initialize SIP client: ${error}`
      throw error
    }
  }

  validateDestinationNumber() {
    if (!this.destinationNumber) {
      this.inputError = 'Please enter a destination number'
      return false
    }
    if (!/^\d+$/.test(this.destinationNumber)) {
      this.inputError = 'Please enter only numbers'
      return false
    }
    this.inputError = ''
    return true
  }

  async makeCall(phoneNumber) {
    if (!this.userAgent) throw new Error('SIP not initialized')

    // Validate the destination number
    this.destinationNumber = phoneNumber // Set the phone number to the instance variable
    if (!this.validateDestinationNumber()) {
      throw new Error(this.inputError)
    }

    const targetUri = `sip:${this.destinationNumber}@sip.xtrevo.com`
    console.log('Attempting to call:', targetUri)

    try {
      this.session = await this.userAgent.call(targetUri, {
        extraHeaders: ['X-Custom-Header: CustomValue'],
        sessionDescriptionHandlerOptions: {
          iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
          constraints: { audio: true, video: false },
        },
      })

      if (this.session) {
        console.log('Call session created:', this.session)
        this.session.stateChange.addListener(state => {
          console.log(`Current call state: ${state}`)
          if (state === 'terminated') {
            console.warn('Session terminated.')
            this.session = null
          }
        })
        return this.session
      } else {
        throw new Error('Failed to create session')
      }
    } catch (error) {
      console.error('Error making call:', error)
      throw error
    }
  }

  async answerCall(session) {
    if (!session) throw new Error('No session to answer')

    try {
      await session.accept({
        sessionDescriptionHandlerOptions: {
          iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
          constraints: { audio: true, video: false },
        },
      })
      console.log('Call answered')
    } catch (error) {
      console.error('Error answering call:', error)
      throw error
    }
  }

  async rejectCall(session) {
    if (!session) throw new Error('No session to reject')

    try {
      await session.reject()
      console.log('Call rejected')
    } catch (error) {
      console.error('Error rejecting call:', error)
      throw error
    }
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks
  }

  async disconnect() {
    if (this.userAgent) {
      try {
        if (this.session) {
          await this.session.terminate()
          this.session = null
        }
        await this.userAgent.unregister()
        await this.userAgent.disconnect()
        this.userAgent = null
        console.log('Disconnected successfully')
      } catch (error) {
        console.error('Error disconnecting:', error)
        throw error
      }
    }
  }
}
