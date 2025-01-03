import { expect } from "chai";
import sinon from "sinon";
import { tick } from 'svelte';
import { setupDOM as setupJSDOM } from "./dom";

/**
 * @param {sinon.stub}
 * @param {double} simulated DOMHighResTimestamp argument to pass to each callback
 * @param {bool}
 */
let callRAFCallbacks = (rafStub:sinon.SinonStub<[(now:number)=>void],any>, now:number, reset=true) => {
    let funcs:((now:number)=>void)[] = rafStub.getCalls().map((call:sinon.SinonSpyCall) => call.args[0]);
    if(reset) {
        rafStub.reset();
    }
    funcs.forEach(f => f(now));
};

/**
 * Utility function to setup a DOM environment
 * @param {object} [domOpts] - any additional options to pass to jsdom
 */
function setupDOM(domOpts?:object) {
    setupJSDOM(
        undefined, 
        {url: "http://localhost", ...domOpts}, 
        {}, 
        ["atob", "ResizeObserver", "testLog", "requestAnimationFrame"]);
}

export { 
    callRAFCallbacks, 
    setupDOM,
};
