import { test } from 'ava'
import { Matcher } from './matcher'

test('basic initialzation', t => {
  let matcher = new Matcher('foo/#/baz')
  t.deepEqual(matcher.topic,'foo/#')
  t.deepEqual(matcher.pattern,'foo/#/baz')
  t.deepEqual (matcher.test('foo/bar/baz'), true)
})

test('simple matcher ', t => {
  let matcher = new Matcher('foo/baz')
  t.deepEqual(matcher.topic,'foo/baz')
  t.deepEqual(matcher.pattern,'foo/baz')
  t.deepEqual (matcher.test('foo/baz'), true)
  t.deepEqual (matcher.match('foo/baz'), [])
})

test('matcher with +', t => {
  let matcher = new Matcher('foo/+')
  t.deepEqual(matcher.topic,'foo/+')
  t.deepEqual(matcher.pattern,'foo/+')
  t.deepEqual (matcher.test('foo/baz'), true)
  t.deepEqual (matcher.test('foo/bar'), true)
  t.deepEqual (matcher.test('bar/bar'), false)
  t.deepEqual (matcher.test('foo/bar/baz'), false)
  t.deepEqual (matcher.match('foo/baz'), ['baz'])
})
test('matcher with multi +', t => {
  let matcher = new Matcher('foo/+/bar/+')
  t.deepEqual(matcher.topic,'foo/+/bar/+')
  t.deepEqual(matcher.pattern,'foo/+/bar/+')
  t.deepEqual (matcher.test('foo/baz/bar/foo'), true)
  t.deepEqual (matcher.test('foo/baz/baz/baz'), false)
  t.deepEqual (matcher.match('foo/bar/bar/foo'), ['bar','foo'])
})

test('matcher with # in the end', t=>{
    let matcher = new Matcher('foo/#')
    t.deepEqual(matcher.test('foo/bar'),true);
    t.deepEqual(matcher.test('bar/baz'),false);
    t.deepEqual(matcher.test('foo/bar/baz'),true);
    t.deepEqual(matcher.match('foo/bar/baz'),['bar/baz']);
});
test('matcher with # in the middle (non-standard)', t=>{
    let matcher = new Matcher('foo/#/foo')
      t.deepEqual(matcher.topic,'foo/#')
    t.deepEqual(matcher.test('foo/bar/foo'),true);
    t.deepEqual(matcher.test('foo/bar/baz/foo'),true);
    t.deepEqual(matcher.test('bar/baz/bar'),false);
    t.deepEqual(matcher.test('bar/foo/baz/bar'),false);
    t.deepEqual(matcher.match('foo/bar/foo'),['bar']);
    t.deepEqual(matcher.match('foo/bar/baz/foo'),['bar/baz']);
});

test('really complex matcher with # and + mixed (non-standard)', t=>{
    let matcher = new Matcher('foo/#/foo/+/foo')
      t.deepEqual(matcher.topic,'foo/#')
      t.deepEqual(matcher.match('foo/bar/foo/baz/foo'),['bar','baz']);
      t.deepEqual(matcher.match('foo/bar/foo/foo/baz/foo'),['bar/foo','baz']);
});
