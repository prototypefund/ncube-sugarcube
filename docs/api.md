# The SugarCube API

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Plugin Runner](#plugin-runner)
  - [Runable](#runable)
  - [runner](#runner)
- [plugin](#plugin)
  - [id](#id)
  - [fmap](#fmap)
  - [pure](#pure)
  - [apply](#apply)
  - [liftA2](#lifta2)
  - [liftManyA2](#liftmanya2)
- [envelope](#envelope)
  - [Queries](#queries)
  - [Envelope](#envelope)
  - [envelope](#envelope-1)
  - [envelopeData](#envelopedata)
  - [envelopeQueries](#envelopequeries)
  - [equals](#equals)
  - [equalsData](#equalsdata)
  - [equalsQueries](#equalsqueries)
  - [empty](#empty)
  - [concat](#concat)
  - [concatData](#concatdata)
  - [concatDataLeft](#concatdataleft)
  - [concatQueries](#concatqueries)
  - [concatQueriesLeft](#concatqueriesleft)
  - [fmap](#fmap-1)
  - [fmapData](#fmapdata)
  - [fmapQueries](#fmapqueries)
  - [fmapAsync](#fmapasync)
  - [fmapDataAsync](#fmapdataasync)
  - [fmapQueriesAsync](#fmapqueriesasync)
  - [filter](#filter)
  - [filterData](#filterdata)
  - [filterQueries](#filterqueries)
- [utils.plugins](#utilsplugins)
  - [listPackageJson](#listpackagejson)
  - [listNodeModules](#listnodemodules)
  - [list](#list)
  - [load](#load)
  - [options](#options)
- [utils.combinators](#utilscombinators)
  - [reduceP](#reducep)
- [utils.hasher](#utilshasher)
- [utils.assertions](#utilsassertions)
- [utils.fs](#utilsfs)
  - [unfold](#unfold)
- [test.generators](#testgenerators)
  - [listArb](#listarb)
  - [listsArb](#listsarb)
  - [lists](#lists)
  - [queryArb](#queryarb)
  - [queriesArb](#queriesarb)
  - [queries](#queries)
  - [unitArb](#unitarb)
  - [unit](#unit)
  - [dataArb](#dataarb)
  - [data](#data)
  - [envelopeArb](#envelopearb)
  - [envelope](#envelope-2)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Plugin Runner

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Runable

A runable sugarcube pipeline.

Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

**Properties**

-   `marker` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The id of this run.
-   `stream` **[stream](https://nodejs.org/api/stream.html)** A BaconJS stream, which is used to communicate
    between the progress of the sugarcube pipeline and caller of the
    pipeline. It has the full BaconJS API available.

### runner

Create a runable sugarcube object.

Construct a SugarCube pipeline. The pipeline is a function that can be
called without any arguments. It will return a promise that resolves to the
result of the pipeline run. The pipeline has a stream object is used to
receive messages during the pipeline run. It's currently mainly used for
logging purposes, but can be used for more as well.

The stream sends messages with the following types:

-   `log_info`
-   `log_debug`
-   `log_error`
-   `plugin_start`
-   `plugin_end`

The pipeline also exports an id, called a `marker`.

**Parameters**

-   `config` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Configuration for a sugarcube run.
-   `queryIds` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** A list of ids to query.

**Examples**

```javascript
const run = runner(config, queryIds);

run.stream.onValue(msg => {
  switch (msg.type) {
    case 'log_info': console.log(msg.msg); break;
    // ... other cases ...
    default: break;
  }
});

run();
```

Returns **[Runable](#runable)** A configured SugarCube run function.

## plugin

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### id

A promised identity function.

`id :: a -> Future a`

**Parameters**

-   `The` **Any** value to returns.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** A promise of the value that was supplied.

### fmap

Map a function over a Functor

`fmap :: Functor f => (a -> Future b) -> f (Future a) -> Future b`
`fmap :: Functor f => (a -> b) -> f a -> Future b`

**Parameters**

-   `f` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** The function to apply to the Functor.
-   `p` **([Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | Any)** The functor value to map.

**Examples**

```javascript
const p = () => Promise.resolve(1);
const f = v => v + 1;
fmap(f, p);  // Returns a promise resolving to 2.
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** A promise resolving to the value of p mapped over f.

### pure

Lift a value into an applicative.

`pure :: Applicative f => a -> f (Future a)`

**Parameters**

-   `a` **Any** The value to lift.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** A promise that resolves to a.

### apply

Apply a function wrapped in a promise to a promisified value.

`apply :: Applicative f => f (a -> Future b) -> f (Future a) -> f (Future b)`
`apply :: Applicative f => f (a -> b) -> f a -> f (Future b)`

**Parameters**

-   `pf` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>** A promise that resolves to a function.
-   `p` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** A promise that resolves to a value.

**Examples**

```javascript
const pf = Promise.resolve(v => v + 1);
const p = Promise.resolve(1);
apply(pf, p); // Returns a promise resolving to 2.
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** A promise resolving to p applied to the function
that pf resolves to.

### liftA2

Lift a binary function over two Applicative.

`liftA2 :: Applicative f => f (a -> b -> Future c) -> f (Future a)
                            -> f (Future b) -> f (Future c)`
`liftA2 :: Applicative f => f (a -> b -> Future c) -> f a -> f b -> f (Future c)`

**Parameters**

-   `f` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)&lt;Any, Any>** A binary function.
-   `a` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** A promise that resolves to a value.
-   `b` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** A promise that resolves to a value.

**Examples**

```javascript
const a = Promise.resolve(envelope);
const b = Promise.resolve(env);
liftA2(plugin, a, b); // Calls plugin with the value that a and b resolve to.
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** The value that f returns when applied to a and b.

### liftManyA2

Lift many binary functions over two Applicatives.

    liftManyA2 :: Applicative f => [f (a -> b -> Future c)] -> f (Future a)
                                   -> f (Future b) -> f (Future c)
    liftManyA2 :: Applicative f => [f (a -> b -> Future c)] -> f a -> f b
                                   -> f (Future c)

**Parameters**

-   `fs` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>** A list of binary functions.
-   `a` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** A promise that resolves to a value.
-   `b` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** A promise that resolves to a value.

**Examples**

```javascript
const a = Promise.resolve(envelope);
const b = Promise.resolve(env);
liftManyA2([f1, f2], a, b); // f1(a,b).then(r => f2(r, b)).then(...)
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Any>** The value that that returns when reducing `a` and
`b` over `fs`.

## envelope

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Queries

Queries are a list of questions.

Type: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>

### Envelope

Envelopes wrap around data and queries.

Envelopes have an equivalence relation and form therefore a setoid. They
provide an associative binary operation and an identity element and
therefore form a monoid. They further implement the interface for functors.

Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

**Properties**

-   `data` **Data** A list of units of this envelope.
-   `queries` **[Queries](#queries)** A list of queries of this envelope.

### envelope

Construct a new envelope.

`envelope :: (Data a, Queries b) => a -> b -> Envelope`

**Parameters**

-   `data` **Data** A list of units.
-   `queries` **[Queries](#queries)** A list of queries.

Returns **[Envelope](#envelope)** A new envelope constructed from `data` and `queries`.

### envelopeData

Like `envelope`, but only data has to be provided. Queries are empty.

**Parameters**

-   `data`  

### envelopeQueries

Like `envelope`, but only queries have to be provided. Data is empty.

**Parameters**

-   `queries`  

### equals

Test two Envelopes for equality. Two envelopes are regarded as equals if
each, data and queries, are equal.

`equals :: (Setoid s, Env a) => s a -> s a -> Bool`

**Parameters**

-   `a` **[Envelope](#envelope)** The first envelope to compare.
-   `b` **[Envelope](#envelope)** The second envelop to compare.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Returns `true` if both envelopes are equal, otherwise
`false`.

### equalsData

Like `equals`, but only the equality `data` is compared.

### equalsQueries

Like `equals`, but only the equality `queries` is compared.

### empty

Create an empty envelope, which contains one empty `data` field and one
empty `queries` field. This forms the identity element for a monoid.

`empty :: Monoid m => m []`

Returns **[Envelope](#envelope)** An empty envelope.

### concat

Concatenate two envelopes. This concatenates `data` and `queries` of each
envelope separately. This provides the binary associative operation under a
monoid.

`concat :: (Monoid m, Env a) => m a -> m a -> m a`

**Parameters**

-   `a` **[Envelope](#envelope)** The source envelope to merge.
-   `b` **[Envelope](#envelope)** The target envelope to merge.

Returns **[Envelope](#envelope)** The result of concatenationg b into a.

### concatData

Similar to `concat`, but only concatenates data and `data` of an envelope.
Removes duplicate (by identity) units in the same envelope.

`concatData :: (Monoid m, Data a, Envelope b) => m a -> m b -> m b`

**Parameters**

-   `a` **Data** A list of units.
-   `b` **[Envelope](#envelope)** An envelope.

Returns **[Envelope](#envelope)** A new envelope with `a` concatenated into `e.data`.

### concatDataLeft

Same as `concatData`, but Prefers newer data

### concatQueries

Same as `concatData`, but then for queries.

### concatQueriesLeft

Same as `concatQueries`, but prefers new queries

### fmap

Map a function over the data, and another one over queries of an envelope.

`fmap :: (Functor f, Env a) => (x -> y) -> (v -> w) -> f a -> f a`

**Parameters**

-   `f` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A function to map over a list of units.
-   `g` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A function to map over a list of queries.
-   `e` **[Envelope](#envelope)** A envelope to map over.

Returns **[Envelope](#envelope)** A result envelope with `f` mapped over `e.data` and `g`
mapped over `e.queries`.

### fmapData

Similar to `fmap`, but only with a single function to map over `data`.

### fmapQueries

Similar to `fmap`, but only with a single function to map over `queries`.

### fmapAsync

The asynchronous version of `fmap`. The function to map over can either
return a value or the promise for one.

`fmapAsync :: (Functor f, Env a) => (x -> Future y) -> (v -> Future w) -> f a -> Future (f a)`

`fmapAsync :: (Functor f, Env a) => (a -> b) -> f a -> Future (f b)`

**Parameters**

-   `f` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** The function to map over the list of units. This
    function can either return a value, or a promise of a value.
-   `g` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** The function to map over the list of queries. This
    function can either return a value, or a promise of a value.
-   `a` **[Envelope](#envelope)** The envelope.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Envelope](#envelope)>** A promise for a result envelope with `f`
mapped over `e.data` and `g` mapped over `e.queries`.

### fmapDataAsync

Similar to `fmapAsync`, but only with a single function to map over `data`.

### fmapQueriesAsync

Similar to `fmapAsync`, but only with a single function to map over `data`.

### filter

Filter an envelope by one predicate for data, and one for queries.

`filter :: Env a => (x -> Bool) -> (y -> Bool) -> a -> a`

**Parameters**

-   `f` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** The predicate to filter the list of units.
-   `g` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** The predicate to filter the list of queries.
-   `e` **[Envelope](#envelope)** The envelope.

Returns **[Envelope](#envelope)** A result envelope with `data` filtered by `f`, and
`queries` filtered by `g`.

### filterData

Similar to `filter`, but with a single predicate to filter `data`.

### filterQueries

Similar to `filter`, but with a single predicate to filter `queries`.

## utils.plugins

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### listPackageJson

List all sugarcube plugins from the local package.json.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** dependencies A list of plugin names.

### listNodeModules

List all sugarcube plugins found in the `node_modules` directory.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** dependencies A list of plugin names.

### list

The default listing of plugins. Basically if it's in node_modules, it is
available.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** dependencies A list of plugin names.

### load

Load all plugins available for this sugarcube installation.

**Parameters**

-   `deps` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** A list of names of plugins to load.

**Examples**

```javascript
const [plugins, missing] = load(list());
```

-   Throws **any** If any dependency in `package.json` isn't installed or a plugin in
    the config isn't available.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>, [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>>** The plugins object and a
list of modules that could not be loaded.

### options

Return all available options for all available plugins.

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** options The options of every plugin.

## utils.combinators

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### reduceP

Reduce a list of values over an applicative.

    reduceP :: Applicative f => (Future b -> a -> Future b) -> f (Future b)
                                -> [a] -> f (Future b)
    reduceP :: Applicative f => (b -> a -> f b) -> b -> [a] -> f b

**Parameters**

-   `f` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)&lt;[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), any>** The reduce function, takes a promise as
    accumulator and a value.
-   `acc` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** The initial accumulator value.
-   `xs` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any>** A list of values to reduce.

**Examples**

```javascript
reduceP((memo, a) => memo.then(r => r + a), 0, [1,2,3]);
```

## utils.hasher

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## utils.assertions

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## utils.fs

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### unfold

Unfold a glob pattern into a list of file objects.

`unfold :: String -> Future [a]`

**Parameters**

-   `pattern` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A glob file pattern.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>>** A list of file objects. Contains
location, sha256 and md5 sums.

## test.generators

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### listArb

An arbitrary that can be used in `jsverify` based property tests.
It produces a single object that resembles a list.

### listsArb

An arbitrary that can be used in `jsverify` based property tests.
It produces an array of objects, where each object is a list.

### lists

Randonly generate a list of lists.

**Parameters**

-   `size` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number of lists to generate.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** A list of list objects.

### queryArb

An arbitrary that can be used in `jsverify` based property tests.
It produces a single object that resembles a query.

### queriesArb

An arbitrary that can be used in `jsverify` based property tests.
It produces an array of objects, where each object is a list.

### queries

Randonly generate a list of queries.

**Parameters**

-   `size` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number of queries to generate.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** A list of queries.

### unitArb

An arbitrary that can be used in `jsverify` based property tests.
It produces a single object that resembles a unit of data.

### unit

Randomly generate a single unit of data.

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** A unit of data.

### dataArb

An arbitrary that can be used in `jsverify` based property tests.
It produces an array of objects, where each object is a unit of data.

### data

Randonly generate units of data..

**Parameters**

-   `size` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number of data units to generate.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** A list of data units.

### envelopeArb

An arbitrary that can be used in `jsverify` based property tests.
It produces an object that is an envelope..

### envelope

Randomly generate a envelope with data and queries.

**Parameters**

-   `sizeData` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number of data units in the envelope.
-   `sizeQueries` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number of queries in the envelope.

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** A unit of data.