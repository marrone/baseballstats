"use strict";

/**
 * script required once before all the tests by the test runner
 * used to setup our test env, polyfilling etc.
 */

// log function that wont get stripped
var _logger = console;
global.testLog = function() { _logger.log.apply(_logger, arguments); };

global.requestAnimationFrame = (f) => {
    setTimeout(f, 5);
};

import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
chai.use(sinonChai);
