import { test } from 'ava'
import { MqttService,Ha4usMessage } from '../index'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/timeoutWith'
import 'rxjs/add/observable/empty'

import { MqttClientStub } from './MqttClientStub'

test.beforeEach('Establishing mqtt client', (t) => {
  t.context = {
    mqtt: new MqttClientStub()
  }

})

test ('Receive correct message type', (t) => {

  const service = new MqttService(t.context.mqtt)

  let observer = service.observe('/test/hallo2').take(1)

  observer.subscribe((value) => {
    t.is (value.topic,'test/hallo2')
    t.is (value.val,'world')
    t.is (value.retain, false)
  })

  t.context.mqtt.publish('test/hallo2','world',{retain: false,qos: 0})
  return observer

})

test ('Subscribe to pattern', (t) => {
  const service = new MqttService(t.context.mqtt)
  let observer = service.observe('/#/hallo2').take(1)
  observer.subscribe((value) => {
    t.is (value.topic,'test/hallo2')
    t.is (value.ts,12345)
    t.is (value.val,'helloworld')
    t.is (value.retain, false)
    t.deepEqual (value.match, {pattern: '#/hallo2',params: ['test']})
  })

  t.context.mqtt.publish('test/hallo2','{"val":"helloworld","ts":12345}',{retain: false,qos: 0})
  t.context.mqtt.publish('test/hallo1','{"val":"helloworld","ts":12345}',{retain: false,qos: 0})
  return observer

})

test.cb ('can publish', (t) => {
  t.context.mqtt.on('message',(topic: string, payload: Buffer) => {
    t.is (topic,'test/hallo2')
    t.is (payload.toString(),'{"hello":"world"}')

    t.end()
  })

  const service = new MqttService(t.context.mqtt)
  service.publish('test/hallo2',{hello: 'world'}, {qos: 0, retain: false})

})

test.cb ('can set', (t) => {

  t.context.mqtt.on('message',(topic: string, payload: Buffer,packet: Ha4usMessage) => {
    t.is (topic,'test/set/hallo2')
    t.is (payload.toString(),'{"hello":"world"}')
    t.is (packet.retain, false)
    t.end()
  })

  const service = new MqttService(t.context.mqtt)
  service.set('test/hallo2',{hello: 'world'})

})

test ('can get', async (t) => {

  const service = new MqttService(t.context.mqtt)

  let subscription = service.observe('test/hallo2').subscribe()

  service.publish('test/status/hallo2','0815', {qos: 0, retain: true})

  let answer = await service.get('test/hallo2')
  t.deepEqual(answer.topic,'test/status/hallo2')
  t.deepEqual(answer.val,'0815')
  subscription.unsubscribe()

})

test('command loop', async (t) => {
  const service = new MqttService(t.context.mqtt)
  await service.command('test/test', query => {
    console.log ('Query hit')
    query.goodbye = 'earth'
    return query
  })

  let answer = await service.request('test/test',{hello: 'world'})
  t.deepEqual(answer.val,{ hello: 'world', goodbye: 'earth'})

})

test('command loop - timeout (in time)', async (t) => {
  const service = new MqttService(t.context.mqtt)
  await service.command('test/test', async query => {
    console.log ('Query hit')

    return new Promise((resolve) => {
      query.goodbye = 'earth'
      setTimeout(() => {
        resolve(query)
      },1000)
    })
  })

  let answer = await service.request('test/test',{hello: 'world'},2000)
  return t.deepEqual(answer.val,{ hello: 'world', goodbye: 'earth'})

})

test('command loop - timeout (to late)', async (t) => {
  const service = new MqttService(t.context.mqtt)
  await service.command('test/test', async query => {

    return new Promise((resolve) => {
      query.goodbye = 'earth'
      setTimeout(() => {
        resolve(query)
      },2000)
    })
  })

  let answer = service.request('test/test',{hello: 'world'},1000)
  await t.throws(answer, /timeout/i)

})

test('command timeout loop (no answer)', async (t) => {
  const service = new MqttService(t.context.mqtt)

  let answer = service.request('test/test',{hello: 'world'})
  await t.throws(answer, /timeout/i)

})
