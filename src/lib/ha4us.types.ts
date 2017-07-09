import * as MQTT from 'mqtt'

export namespace Ha4usMQTT {
  export interface Message extends MQTT.IPacket {
    /** the mqtt topic to which this message was published to */
    topic: string
    /** the if matched by the mqtt matcher here goes the data */
    match: {
      pattern: string;
      params: string[];
    },
    val: any,
    ts: number,
    old: any,
    lc: number,
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

  export interface Client extends MQTT.Client {}

  export interface IPacket extends MQTT.IPacket {}
  export interface ISubscriptionGrant extends MQTT.ISubscriptionGrant {}

}
