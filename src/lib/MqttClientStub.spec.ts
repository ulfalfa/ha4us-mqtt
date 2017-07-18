import { test } from 'ava'

import { MqttClientStub } from './MqttClientStub'

test ('check subscribe and unsubscribe',t => {
  const stub = new MqttClientStub()
  t.plan (2)
  stub.subscribe('#',{qos: 1},(test => {
    t.is(test,null)
  }))
  stub.unsubscribe('#',{qos: 1},(test => {
    t.is(test,null)
  }))
})
