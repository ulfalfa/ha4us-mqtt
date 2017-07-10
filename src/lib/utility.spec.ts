import { test } from 'ava'
import { MqttUtil } from './utility'

const util = MqttUtil

test('join', t => {
  t.is(util.join(['foo','bar','baz']),'foo/bar/baz')
})
test('split', t => {
  t.deepEqual(util.split('foo/bar/baz'),['foo','bar','baz'])
})

test('inject', t => {
  t.deepEqual(util.inject('foo/bar/baz/foo',1,2),'foo/foo')
  t.deepEqual(util.inject('foo/bar/baz/foo',1),'foo')
  t.deepEqual(util.inject('foo/bar/baz/foo',1,3),'foo')
  t.deepEqual(util.inject('foo/bar/baz/foo',2),'foo/bar')
  t.deepEqual(util.inject('foo/bar/baz/foo',1,2,'bar/baz'),'foo/bar/baz/foo')
})

test('resolve', t => {
  t.deepEqual(util.resolve('/foo/bar/baz'),'foo/bar/baz')
  t.deepEqual(util.resolve('foo/bar/baz'),'foo/bar/baz')
  t.deepEqual(util.resolve('/foo/bar/baz','xyz'),'foo/bar/baz')
  t.deepEqual(util.resolve('foo/bar/baz','xyz'),'foo/xyz/bar/baz')
  t.deepEqual(util.resolve('foo/bar/baz','xyz','domain'),'foo/xyz/bar/baz')
  t.deepEqual(util.resolve('$foo/bar/baz','xyz','domain'),'domain/xyz/foo/bar/baz')
  t.deepEqual(util.resolve('/$foo/bar/baz','xyz','domain'),'$foo/bar/baz')
})

test('valid topic', t => {
  t.deepEqual(util.validTopic('foo/bar/baz/foo'),true)
  t.deepEqual(util.validTopic('foo/bar/+/foo'),false)
  t.deepEqual(util.validTopic('foo/bar/#/foo'),false)

})
test('valid pattern', t => {
  t.deepEqual(util.validPattern('foo/bar/baz/foo'),true)
  t.deepEqual(util.validPattern('foo/bar/+/foo'),true)
  t.deepEqual(util.validPattern('foo/bar/#/foo'),true)

})

test ('buffer conversion', t => {
  let message: Buffer
  message = new Buffer('true')
  t.is (util.convertBuffer(message),true)
  message = new Buffer('test')
  t.is (util.convertBuffer(message),'test')
  message = new Buffer('1.2345')
  t.is (util.convertBuffer(message),1.2345)
  message = new Buffer('{"hello":"world"}')
  t.deepEqual (util.convertBuffer(message),{hello: 'world'})
})
