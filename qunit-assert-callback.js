﻿/**
 * qunit-assert-callback
 * A QUnit assert plugin to test sync callback.
 * You can easily assert that the callback can (only) be called at the correct moment,
 * and has the correct times.
 * 
 * Author: Jare https://github.com/jareguo/
 * Homepage: https://github.com/jareguo/qunit-assert-callback
 * Copyright (C) FireBox http://www.firebox.im/
 * Licensed under the MIT license.
 */

/**
 * Create and return a new callback wrapper for handling assertion.
 * By default, the callback is not allowed to call unless you call its enable method first.
 * 
 * @example
 *     obj.onDown = assert.callback();          // disabled by default
 *     var foo = function() { obj.onDown() };
 *     foo();   // Assertion failed! onDown should not be called in foo!
 *
 * @example
 *     obj.onDown = assert.callback().enable(); // enabled this time ;)
 *     var foo = function() { obj.onDown() };
 *     foo();   // No error this time ;)
 *     obj.onDown.once('onDown should be called once');   // Assertion succeeded! 
 *
 * @param {function} [callbackFunction_opt] - You can pass in a callback when the wrapper is called. (@see wrapper.callbackFunction)
 * @example Example usage of callbackFunction_opt
 *     obj.onUp = assert.callback().enable();
 *     obj.onDown = assert.callback( function(val) {
 *         equal(this, obj,     'Can test this');
 *         equal(val,  520,     'Can test argument');
 *         equal(obj.onUp.calledCount, 1, 'Can test call order');
 *     }).enable();                             // dont forget enable!
 *     obj.upAndDown = function() { obj.onUp(); obj.onDown('Jare') };
 *     obj.upAndDown();
 *     obj.onDown.expect(1);    // Okey!
 */
function callback(callbackFunction_opt) {
    var enabled = false;

    var callbackName_ = 'Callback';
    var msgWhenDisabled_ = '';
    var callbackFunction_ = callbackFunction_opt;

    var wrapper = function () {
        if (!enabled) {
            var message = callbackName_ + ' can be called only after enable()'
            QUnit.push(false, message, message, msgWhenDisabled_);
            return;
        }
        ++wrapper.calledCount;
        if (callbackFunction_) {
            callbackFunction_.apply(this, arguments);
        }
    };

    wrapper.calledCount = 0;

    wrapper.setName = function (callbackName) {
        callbackName_ = callbackName;
        return wrapper;
    };
    wrapper.setDisabledMessage = function (msgWhenDisabled) {
        msgWhenDisabled_ = msgWhenDisabled;
        return wrapper;
    };

    /**
     * Use this method to register a callback when the wrapper is called
     *
     * @example
     *     obj.onUp = assert.callback().enable();
     *     obj.onDown = assert.callback().enable();
     *     obj.onDown.callbackFunction( function(val) {
     *         equal(this, obj,     'Can test this');
     *         equal(val,  520,     'Can test argument');
     *         equal(obj.onUp.calledCount, 1, 'Can test call order');
     *     });
     *     obj.upAndDown = function() { obj.onUp(); obj.onDown('Jare') };
     *     obj.upAndDown();
     *     obj.onDown.expect(1);    // Okey!
     */
    wrapper.callbackFunction = function (callbackFunction) {
        callbackFunction_ = callbackFunction;
        return wrapper;
    };

    /**
     * By default, the callback is not allowed to call unless you call its enable method first.
     * You can enable and disable repeatedly.
     * @see wrapper.disable
     */
    wrapper.enable = function () {
        enabled = true;
        return wrapper;
    };

    /**
     * You can disable the callback if you think it should not be called anymore.
     * You can enable and disable repeatedly.
     *
     * @example
     *     obj.onDown = assert.callback().enable();
     *     var foo = function() { obj.onDown() };
     *     foo();
     *     obj.onDown.once('onDown should be called')
     *               .disable('onDown should not be called from now on');
     *     foo();       // Assertion failed: onDown should not be called from now on
     *     obj.onDown.enable();
     *     foo();
     *     obj.onDown.once('onDown should be called again')
     *               .disable('onDown should not be called anymore');
     *     foo();       // Assertion failed: onDown should not be called anymore
     */
    wrapper.disable = function (msgWhenDisabled_opt) {
        enabled = false;
        msgWhenDisabled_ = msgWhenDisabled_opt;
        return wrapper;
    };

    /**
     * Expect the callback to be called any times you like
     *
     * @example
     *     obj.onDown = assert.callback().enable();
     *     vaf down = function() { obj.onDown() };
     *     down();
     *     obj.onDown.expect(1);    // Okey!
     *     down();
     *     obj.onDown.expect(2);    // Okey!
     *     down();
     *     down();
     *     obj.onDown.expect(4);    // Okey!
     */
    wrapper.expect = function (count, message_opt) {
        var result = wrapper.calledCount == count;
        var message_opt = message_opt || callbackName_ + ' should be called ' + count + ' time(s)' + (result ? '' : '. Actual: ' + wrapper.calledCount);
        QUnit.push(result, wrapper.calledCount.toString() + ' time(s)', count + ' time(s)', message_opt);
        return wrapper;
    };

    /**
     * Expect the callback to be called one time, and then reset the time to 0
     * so that you can do this repeatedly.
     *
     * @example
     *     obj.onDown = assert.callback().enable();
     *     obj.down = function() { obj.onDown() };
     *     obj.down();
     *     obj.onDown.once();    // Okey!
     *     obj.down();
     *     obj.onDown.once();    // Okey!
     *     obj.down();
     *     obj.down();
     *     obj.onDown.once();    // Failed because obj.onDown being called twice!
     */
    wrapper.once = function (message_opt) {
        wrapper.expect(1, message_opt);
        wrapper.calledCount = 0;
        return wrapper;
    };

    return wrapper;
}

QUnit.extend(QUnit.assert, {
    callback: callback
});

QUnit.extend(QUnit, {
    separator: function () {
        module('');
        test('----------------------------------------------------------------------------------------------------------------------------', 0, function () {});
    }
});

QUnit.extend(window, {
    separator: QUnit.separator
});
