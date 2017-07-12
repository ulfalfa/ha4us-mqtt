const VALID_TOPIC = /^[^#\+]+$/
const VALID_PATTERN =
  /^(([\+#]{1}|[^\+#]*)\/)?(([\+#]{1}|[^\+#]*)\/{1})*(([\+#]{1}|[^\+#]*))$/

export namespace MqttUtil {

export const MQTT_SEP: string = '/'

export function join (topics: string[]): string {
  return topics.join(MQTT_SEP)
}

export function split (topic: string): string[] {
  return topic.split(MQTT_SEP)
}

export function inject (topic: string, index: number, count: number= 999, ...members: string[] ): string {
  let topicArr = split(topic)
  topicArr.splice(index,count, ...members)
  return join(topicArr)
}

export function resolve (topic: string, command?: string,domain?: string ): string {

  if (domain) {
    topic = topic.replace(/\$/,domain + MQTT_SEP)
  }

  if (topic.charAt(0) === MQTT_SEP) {
    return topic.substring(1)
  } else if (command) {
    topic = inject(topic, 1,0,command)
  }
  return topic
}

export function validTopic (topic: string): boolean {
  return VALID_TOPIC.test(topic)
}

export function validPattern (pattern: string): boolean {
  return VALID_PATTERN.test(pattern)
}

export function isPattern (pattern: string): boolean {
  return !validTopic(pattern) && validPattern(pattern)
}

export function convertBuffer (message: Uint8Array): any {
  let retVal: string = new Buffer(message).toString()

  try {
    retVal = JSON.parse(retVal)
  } finally {
    return retVal
  }

}
}
