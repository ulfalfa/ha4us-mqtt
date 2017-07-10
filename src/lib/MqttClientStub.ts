
import { MqttClient,ISubscriptionGrant } from '..'
import {EventEmitter} from 'events';
import * as Debug from 'debug';

const debug = Debug('ha4us-mqtt:stub');

export class MqttClientStub  extends EventEmitter implements MqttClient  {

  subscribe(topic: string, options?: {qos?:number}, callback?:(err:any,grants:ISubscriptionGrant[])=>void): MqttClientStub {
    debug ('Subscribe', topic);
  let qos:number = (options && options.qos) ? options.qos : 0;
    if (callback) {
      callback(null,[{topic:topic,qos:qos}]);
    }
    return this;

  }
  //subscribe(topic: string[], options?: {qos?:number}, cb?:(err:any,grants:ISubscriptionGrant[])=>void): Client;
  unsubscribe(topic: string, options?: {qos?:number}, callback?:(err:any,grants:ISubscriptionGrant[])=>void): MqttClientStub {
    debug ('Unsubscribe', topic);

    let qos:number = (options && options.qos) ? options.qos : 0;

    if (callback) {
      callback(null,[{topic:topic,qos:qos}]);
    }
    return this;

  }
  //unsubscribe(topic: string[], options?: {qos?:number}, cb?:(err:any,grants:ISubscriptionGrant[])=>void):Client;
  publish(topic: string, message: string, options: {qos:0, retain:false}, callback?: Function): MqttClientStub {
    let buffered = new Buffer(message);
    let packet=  {
      cmd: 'publish',
      qos: options.qos,
      dup: false,
      retain: options.retain,
      topic: topic,
      payload: buffered
    }
    this.emit('message', topic, buffered, packet);
    if (callback) {
      callback(null);
    }
    return this;
  }

}
