
const VALID_TOPIC = /^[^#\+]+$/
const VALID_PATTERN =
  /^(([\+#]{1}|[^\+#]*)\/)?(([\+#]{1}|[^\+#]*)\/{1})*(([\+#]{1}|[^\+#]*))$/

export const MQTT_SEP: string = '/'

export function join (topics: string[]): string {
  return topics.join(MQTT_SEP)
}

export function split (topic: string): string[] {
  return topic.split(MQTT_SEP)
}

export function inject (topic: string, index: number, count: number, ...members ): string {
  let topicArr = split(topic)
  topicArr.splice(index,count, ...members)
  return join(topicArr)
}

export function resolve (topic: string, domain: string, command: string): string {
  if (topic.charAt(0) === MQTT_SEP) {
    return topic.substring(1)
  } else {
    if (topic.charAt(0) === '$') {
      topic = domain + MQTT_SEP + topic
    }
    return inject(topic, 1,0,command)
  }
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
