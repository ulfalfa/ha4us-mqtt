// import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
// import { Observer } from 'rxjs/Observer'
import { UsingObservable } from 'rxjs/observable/UsingObservable'
import { Subject } from 'rxjs/Subject'
import { Subscription, AnonymousSubscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/publishReplay'

import { Ha4usMQTT, Matcher } from '..'

/*
/**
 * With an instance of MqttService, you can observe and subscribe to MQTT in multiple places, e.g. in different components,
 * to only subscribe to the broker once per MQTT filter.
 * It also handles proper unsubscription from the broker, if the last observable with a filter is closed.
 */
export class MqttService {
  /** a map of all mqtt observables by filter */
  public observables: { [filter: string]: Observable<Ha4usMQTT.Message>} = {}
  /** an observable of the last mqtt message */
  public messages: Observable<Ha4usMQTT.IPacket> = new Observable<Ha4usMQTT.IPacket>()

  /**
   * The constructor needs [connection options]{@link MqttServiceOptions} regarding the broker and some
   * options to configure behavior of this service, like if the connection to the broker
   * should be established on creation of this service or not.
   * @param options connection and creation options for MQTT.js and this service
   * @param client an instance of MQTT.Client
   */
  constructor (private client: Ha4usMQTT.Client) {
/*
    this.messages = Observable.fromEvent(client, 'message',(topic, message, packet: Ha4usMQTT.IPacket) => ({
      cmd: packet.cmd,
      topic: topic,
      message: message,
      packet: packet
    }))
*/
    this.messages = Observable.fromEvent(client, 'message')
  }

  /**
   * With this method, you can observe messages for a mqtt topic.
   * The observable will only emit messages matching the filter.
   * The first one subscribing to the resulting observable executes a mqtt subscribe.
   * The last one unsubscribing this filter executes a mqtt unsubscribe.
   * @param  {string}                  filter
   * @return {Observable<MqttMessage>}        the observable you can subscribe to
   */
  public observe (filter: string): Observable<Ha4usMQTT.Message> {
    if (!this.client) {
      throw new Error('mqtt client not connected')
    }
    let pattern = new Matcher(filter)

    if (!this.observables[filter]) {
      const rejected = new Subject()
      this.observables[filter] = UsingObservable
        .create(
        // resourceFactory: Do the actual ref-counting MQTT subscription.
        // refcount is decreased on unsubscribe.
        () => {
          const subscription: Subscription = new Subscription()
          this.client.subscribe(pattern.topic, (err, granted: Ha4usMQTT.ISubscriptionGrant[]) => {
            granted.forEach((_granted: Ha4usMQTT.ISubscriptionGrant) => {
              if (err ) {
                rejected.error(`error subscribing '${pattern.topic}'`)
              }
              if (_granted.qos === 128) {
                delete this.observables[_granted.topic]
                this.client.unsubscribe(_granted.topic)
                rejected.error(`subscription for '${_granted.topic}' rejected!`)
              }
            })
          })
          subscription.add(() => {
            delete this.observables[filter]
            this.client.unsubscribe(filter)
          })
          return subscription
        },
        // observableFactory: Create the observable that is consumed from.
        // This part is not executed until the Observable returned by
        // `observe` gets actually subscribed.
        (subscription: AnonymousSubscription) => Observable.merge(rejected, this.messages))
        .filter((msg: Ha4usMQTT.Message) => pattern.test(msg.topic))
        .publishReplay(1)
        .refCount() as Observable<Ha4usMQTT.Message>
    }
    return this.observables[filter]
  }

  /**
   * This method publishes a message for a topic with optional options.
   * The returned observable will complete, if publishing was successful
   * and will throw an error, if the publication fails
   * @param  {string}           topic
   * @param  {any}              message
   * @param  {PublishOptions}   options
   * @return {Observable<void>}
   */
/*
  public publish(topic: string, message: any, options?: PublishOptions): Observable<void> {
    if (!this.client) {
      throw new Error('mqtt client not connected');
    }
    const source = Observable.create((obs: Observer<void>) => {
      this.client.publish(topic, message, options, (err: Error) => {
        if (err) {
          obs.error(err);
        } else {
          obs.complete();
        }
      });
    });
    return source;
  }
  */

  /**
   * This method publishes a message for a topic with optional options.
   * If an error occurs, it will throw.
   * @param  {string}           topic
   * @param  {any}              message
   * @param  {PublishOptions}   options
   */

/*
  public unsafePublish(topic: string, message: any, options?: PublishOptions): void {
    if (!this.client) {
      throw new Error('mqtt client not connected');
    }
    this.client.publish(topic, message, options, (err: Error) => {
      if (err) {
        throw (err);
      }
    });
  }

}
*/

}
