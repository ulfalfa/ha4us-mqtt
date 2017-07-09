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

test('Initialize Server', async (t) => {
  const service = new MqttService(t.context.mqtt)

  const observer = service.observe('#/hallo')
    .subscribe((value) => {
      console.log (value)
    })

  t.context.mqtt.publish('test/hallo','world',{retain: false})

})
