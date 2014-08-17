# QUnit callback assertion plugin

A QUnit assert plugin to test sync callback. You can easily assert that the callback can (only) be called at the correct moment, and has the correct times.

## Usage

```js
var obj;

// Create and return a new callback wrapper for handling assertion.
obj.callback = assert.callback(callbackFunction_opt);

// By default, the callback is not allowed to call unless you call its enable method first.
// You can enable and disable repeatedly.
obj.callback.enable();
obj.callback.disable(msgWhenDisabled_opt);

// Expect the callback to be called any times you wish
obj.callback.expect(count, message_opt);

// Expect the callback to be called one time, and then reset the time to 0
// so that you can do this repeatedly.
obj.callback.once(message_opt);
```

## Examples

### Make Assertion failed if called

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

### Expect the callback to be called any times you wish

```js
obj.onDown = assert.callback().enable();
vaf down = function() { obj.onDown() };

down();
obj.onDown.expect(1);    // Okey!
down();
obj.onDown.expect(2);    // Okey!
down();
down();
obj.onDown.expect(4);    // Okey!
```

### Disable the callback if you think it should not be called anymore.

```js
obj.onDown = assert.callback().enable();
var foo = function() { obj.onDown() };

foo();
obj.onDown.once('onDown should be called')
          .disable('onDown should not be called from now on');
foo();       // Assertion failed: onDown should not be called from now on
obj.onDown.enable();
foo();
obj.onDown.once('onDown should be called again')
          .disable('onDown should not be called anymore');
foo();       // Assertion failed: onDown should not be called anymore
```

### You can register a callback when the wrapper is called.

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
