export const sipConfig = {
  account: {
    username: '101',
    password: 'severalleddepend8912@@',
    domain: 'sip.xtrevo.com',
  },
  connection: {
    preloadedRoute: 'sip:sip.xtrevo.com;transport=wss',
    websocket: 'wss://sip.xtrevo.com:8443/asterisk-wss',
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
      },
    ],
  },
  media: {
    constraints: {
      audio: true,
      video: false,
    },
    dtmfOptions: {
      duration: 100,
      interToneGap: 70,
    },
  },
  options: {
    registerExpires: 300,
    registererOptions: {
      expires: 300,
    },
    userAgentString: 'XCalls VoIP Client',
    noAnswerTimeout: 60,
    hackIpInContact: true,
    hackViaTcp: true,
    hackWssInTransport: true,
    allowLegacyNotifications: true,
    traceSip: true,
  },
}
