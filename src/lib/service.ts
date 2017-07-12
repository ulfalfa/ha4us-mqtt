// import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable,Observer,Subject,Subscription } from 'rxjs/Rx'
import { UsingObservable } from 'rxjs/observable/UsingObservable'

import { Matcher,MqttMessage,Ha4usMessage,MqttClient,ISubscriptionGrant,MqttUtil,PublishOptions } from '..'

/*35769
/**
 * With an instance of MqttService, you can observe and subscribe to MQTT in multiple places, e.g. in different components,
 * to only subscribe to the broker once per MQTT filter.
 * It also handles proper unsubscription from the broker, if the last observable with a filter is closed.
 */
export class MqttService {
  /** a map of all mqtt observables by filter */
  public observables: { [filter: string]: Observable<Ha4usMessage>} = {}
  /** an observable of the last mqtt message */
  public messages: Observable<MqttMessage> = new Observable<MqttMessage>()

  public domain: string|undefined = undefined

  /**
   * The constructor needs [connection options]{@link MqttServiceOptions} regarding the broker and some
   * options to configure behavior of this service, like if the connection to the broker
   * should be established on creation of this service or not.
   * @param options connection and creation options for MQTT.js and this service
   * @param client an instance of MQTT.Client
   */
  constructor (private client: MqttClient) {
    this.messages = Observable.fromEvent(client, 'message',(_topic,_message,packet) => (packet as MqttMessage))
  }

  /**
   * With this method, you can observe messages for a mqtt topic.
   * The observable will only emit messages matching the filter.
   * The first one subscribing to the resulting observable executes a mqtt subscribe.
   * The last one unsubscribing this filter executes a mqtt unsubscribe.
   * @param  {string}                  filter
   * @return {Observable<MqttMessage>}        the observable you can subscribe to
   */
  public observe (filterInput: string): Observable<Ha4usMessage> {
    if (!this.client) {
      throw new Error('mqtt client not connected')
    }
    let pattern = new Matcher(MqttUtil.resolve(filterInput,'status',this.domain))

    if (!this.observables[pattern.pattern]) {
      const rejected: Subject<MqttMessage> = new Subject()
      this.observables[pattern.pattern] = UsingObservable
        .create(
        // resourceFactory: Do the actual ref-counting MQTT subscription.
        // refcount is decreased on unsubscribe.
        () => {
          const subscription: Subscription = new Subscription()
          this.client.subscribe(pattern.topic, (err: any, granted: ISubscriptionGrant[]) => {
            granted.forEach((_granted: ISubscriptionGrant) => {
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
            delete this.observables[pattern.pattern]
            this.client.unsubscribe(pattern.topic)
          })
          return subscription
        },
        // observableFactory: Create the observable that is consumed from.
        // This part is not executed until the Observable returned by
        // `observe` gets actually subscribed.
        () => Observable.merge(rejected, this.messages))
        .map (message => {
          let match = pattern.match(message.topic)

          let msg = MqttUtil.convertBuffer(message.payload)

          let retVal: Ha4usMessage = {
            topic : message.topic,
            val: msg && msg.hasOwnProperty('val') ? msg.val : msg,
            ts : (msg !== null) && msg.ts ? msg.ts : new Date().valueOf(),
            old: msg && msg.old,
            lc: msg && msg.lc,
            retain: message.retain
          }

          if (match) {
            retVal.match = {
              pattern: pattern.pattern,
              params: match
            }
          }

        return retVal
        })
        .filter((msg) => msg.hasOwnProperty('match'))
        .publishReplay(1)
        .refCount()
    }
    return this.observables[pattern.pattern]
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

  public publish (topic: string, message: any, options?: PublishOptions): Observable<void> {
    if (!this.client) {
      throw new Error('mqtt client not connected')
    }
    const source = Observable.create((obs: Observer<void>) => {
      this.client.publish(topic, JSON.stringify(message), options, (err: Error) => {
        if (err) {
          obs.error(err)
        } else {
          obs.complete()
        }
      })
    })
    return source.toPromise()
  }

  public set (topic: string, value: any) {
    return this.publish(MqttUtil.resolve(topic,'set',this.domain),value,{qos: 0, retain: false})
  }

  public async get (topic: string) {
    let observer = this.observe(topic).take(1)

    await this.publish(MqttUtil.resolve(topic,'get',this.domain),null,{qos: 0, retain: false})
    return observer.toPromise()

  }

}
