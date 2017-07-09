import { test } from 'ava'
import { MqttService } from '../index'

import * as MQTT from 'mqtt'

test.beforeEach('Establishing mqtt client', async (t) => {
  const mqtt = await MQTT.connect('mqtt://test:password@192.168.1.1', {
    clientId: 'testclient_' + Math.random().toString(16).substr(2, 8)
  })
  t.context = {
    mqtt: mqtt
  }
})

test('Initialize Server', (t) => {
  const service = new MqttService(t.context.mqtt)
  t.context.mqtt.publish('hallo','world',{retain: false})

})
