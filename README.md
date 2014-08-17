# QUnit callback assertion plugin

A QUnit assert plugin to test sync callback. You can easily assert that the callback can (only) be called at the correct moment, and has the correct times.

## Usage

```js
var obj;
obj.callback = assert.callback(callbackFunction_opt);
obj.callback.enable();
obj.callback.disable(msgWhenDisabled_opt);
obj.callback.expect(count, message_opt);
obj.callback.once(message_opt);
```

## Examples

### Assert callback not called

```js
obj.onDown = assert.callback();          // disabled by default
var foo = function() { obj.onDown() };
foo();    // Assertion failed! onDown should not be called in foo!
```

### Assert callback called

```js
obj.onDown = assert.callback().enable(); // enabled this time ;)
var foo = function() { obj.onDown() };
foo();   // No error this time ;)
obj.onDown.once('onDown should be called once');   // Assertion succeeded! 
```

### Register real callback

You can register a callback when the wrapper is called.

```js
// callback 1
obj.onUp = assert.callback().enable();
// callback 2
obj.onDown = assert.callback( function(val) {
    equal(this, obj,     'assert this');
    equal(val,  520,     'assert argument');
    equal(obj.onUp.calledCount, 1, 'onUp should be called before onDown!');
}).enable();             // dont forget enable!
obj.upAndDown = function() { obj.onUp(); obj.onDown(520) };
obj.upAndDown();
obj.onDown.expect(1, 'onDown should be called once!');    // Okey!
```
