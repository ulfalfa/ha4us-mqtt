import { test } from 'ava'
import { MqttService } from '../index'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/timeoutWith'
import 'rxjs/add/observable/empty'
//import {Observable} from 'rxjs';
import {MqttClientStub} from './MqttClientStub'

test.beforeEach('Establishing mqtt client',  (t) => {
  t.context = {
    mqtt:new MqttClientStub()
  }

})

test ('Receive correct message type',  (t) => {

  const service = new MqttService(t.context.mqtt)

  let observer = service.observe('test/hallo2').take(1);

    observer.subscribe((value)=>{
      t.is (value.topic,'test/hallo2');
      t.is (value.val,'world');
      t.is (value.retain, false);
    });

  t.context.mqtt.publish('test/hallo2','world',{retain: false,qos:0});
  return observer;

})

test ('Receive correct message type',  (t) => {
  const service = new MqttService(t.context.mqtt)
  let observer = service.observe('#/+').take(1);
    observer.subscribe((value)=>{
      t.is (value.topic,'test/hallo2');
      t.is (value.ts,12345);
      t.is (value.val,'helloworld');
      t.is (value.retain, false);
      t.deepEqual (value.match, {pattern:'#/+',params:['test','hallo2']})
    });

  t.context.mqtt.publish('test/hallo2','{"val":"helloworld","ts":12345}',{retain: false,qos:0});
  return observer;

})
