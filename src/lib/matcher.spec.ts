import { test } from 'ava'
import { Matcher } from './matcher'

test('basic initialzation', t => {

  let matcher = new Matcher('foo/#/baz')
  t.deepEqual(matcher.topic,'foo/#')
  t.deepEqual(matcher.pattern,'foo/#/baz')
  t.deepEqual (matcher.test('foo/bar/baz'), true)
})

test('basic initialzation2 ', t => {

  let matcher = new Matcher('foo/baz')
  t.deepEqual(matcher.topic,'foo/baz')
  t.deepEqual(matcher.pattern,'foo/baz')
  t.deepEqual (matcher.test('foo/baz'), true)
})
