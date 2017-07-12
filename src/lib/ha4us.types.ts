import * as MQTT from 'mqtt'
import { EventEmitter } from 'events'

export interface Ha4usMessage {
    /** the mqtt topic to which this message was published to */
  topic: string
    /** the if matched by the mqtt matcher here goes the data */
  match?: {
    pattern: string
    params: string[]
  }
  val: any
  ts: number
  old?: any
  lc?: number
  retain: boolean
}

export interface MqttMessage extends MQTT.IPacket {
  /** the mqtt topic to which this message was published to */
  topic: string
  /** the payload */
  payload: Uint8Array
  /** the quality of service */
  qos: number
  /** if this message is a retained message */
  retain: boolean
  /** if this message is a dublicate */
  dup: boolean
}

export interface MqttClient extends EventEmitter {
  subscribe (topic: string, options?: {qos?: number}, cb?: (err: any,grants: ISubscriptionGrant[]) => void): MqttClient
  unsubscribe (topic: string, options?: {qos?: number}, cb?: (err: any,grants: ISubscriptionGrant[]) => void): MqttClient
  publish (topic: string, message: string, options?: {qos?: number, retain?: boolean}, callback?: Function): MqttClient

}
export interface ISubscriptionGrant extends MQTT.ISubscriptionGrant {}
export interface PublishOptions {
  retain: boolean
  qos: number
}
