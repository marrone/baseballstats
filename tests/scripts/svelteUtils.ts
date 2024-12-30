// see: https://dev.to/d_ir/mounting-components-and-asserting-on-the-dom-9kc

/// <reference path='../typings/svelte-internal.d.ts' />
import { bind, binding_callbacks, set_raf, clear_loops } from "svelte/internal";
import { tick, SvelteComponent } from 'svelte';
import sinon from "sinon";
import { callRAFCallbacks, setupDOM } from "./util";

/*
 * The setBindingCallbacks is necessary for testing Svelte component bindings.
 * example test spec:
 * 
 *  import { setupDOM } from "@pch/unittest/dom";
 *  import { mount, unmountAll } from "../js/svelteUtils.js";
 *  import ButtonComponent from "../../../src/components/Button.svelte";
 *  
 *  describe(ButtonComponent.name, () => {
 *      setupDOM();
 *      afterEach(unmountAll);
 *
 *      it("renders a button", () => {
 *          mount(ButtonComponent);
 *          expect(document.querySelector("button")).not.to.be(null);
 *      });
 *  });
 */

type SvelteComponentType = typeof SvelteComponent;

const setBindingCallbacks = (bindings:any, component:SvelteComponent) => {
    Object.keys(bindings).forEach(binding => {
        binding_callbacks.push(() => {
            bind(component, binding, (value:any) => {
                bindings[binding] = value;
            });
        });
    });
};

let mountedComponents:SvelteComponent[] = [];

export const mount = (component:SvelteComponentType, props = {}, { bindings = {} } = {}, target = null, opts = {}) => {
    const mounted = new component({
        ...opts,
        target: target || document.body,
        props
    });
    setBindingCallbacks(bindings, mounted);
    mountedComponents = [ mounted, ...mountedComponents ];
    return mounted;
};

export const destroyComponent = (component:SvelteComponent, detaching:boolean) => {
    const $$ = component.$$;
    if($$.fragment !== null) {
        if($$.on_destroy) { 
            $$.on_destroy.forEach((f:()=>void) => f());
        }
        $$.fragment && $$.fragment.d(detaching); 
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
        
        let mountedIndex = mountedComponents.indexOf(component);
        if(mountedIndex >= 0) {
            mountedComponents.splice(mountedIndex, 1);
        }
    }
};

export const unmountAll = () => {
    mountedComponents.forEach((component:SvelteComponent) => {
        component.$destroy();
    });
    mountedComponents = [];
};

/**
 * Utility function to setup svelte component test suites.
 * Call it within your describe() suite, it will setup the DOM
 * and make sure to call unmountAll after each test to clean up
 * after components
 */
export const setupSvelteTests = (domOpts?:object) => {
    setupDOM(domOpts);
    afterEach(unmountAll);
    afterEach(clear_loops);
};

/**
 * Update a component binding triggering reactivity
 *
 * @param {Svelte} component - svelte component instance
 * @param {string|object} propName - the name of the bound prop; or if passing only 2 args, an object of propName/propVal pairs
 * @param {mixed} [value] - the value of the bound prop; optional if passing the pairs as second arg
 */
export function updateBoundValue(component:SvelteComponent, propName:string|Partial<any>, value?:any) {
    if(typeof propName === 'string') { 
        component.$set({[propName]: arguments[2]});
    }
    else { 
        component.$set(propName);
    }
}

/**
 * Get a component bound prop by var name
 *
 * @param {Svelte} component
 * @param {string} propName
 *
 * @return {mixed}
 */
export function getBoundValue(component:SvelteComponent, propName:string) {
    return component.$$.ctx[propName];
}

/**
 * Get a callback function by name from the svelte component instance
 *
 * @param {Svelte} component
 * @param {string} name - the name of the function the svelte component defined
 *
 * @return {function}
 */
export const getCallbackFunc = (component:SvelteComponent, name:string) => {
    let ctx = component.$$.ctx;
    for(let key in ctx) { 
        if(ctx.hasOwnProperty(key) && typeof ctx[key] === 'function' && ctx[key].name === name) {
            return ctx[key];
        }
    }
    return undefined;
};

/**
 * Return a svelte component reference variable by name.
 * This only supports the reactive variables that the svelte 
 * internal tracks.
 *
 * @param {Svelte}
 * @param {mixed} - object prop names that must exist on the target object to match it
 *
 * @return {mixed}
 */
export const getReferenceByPropMatch = (component:SvelteComponent, propMatch:string[]):any => {
    let ctx = component.$$.ctx;
    for(let key in ctx) { 
        if(ctx.hasOwnProperty(key) && !propMatch.some(prop => !(prop in ctx[key]))) { 
            return ctx[key];
        }
    }
    return undefined;
};

/**
 * Return a svelte component reference variable by class type.
 * This only supports the reactive variables that the svelte 
 * internal tracks.
 *
 * @param {Svelte}
 * @param {mixed} - a class constructor
 *
 * @return {mixed}
 */
export const getReferenceByType = (component:SvelteComponent, clazz:()=>void) => {
    let ctx = component.$$.ctx;
    for(let key in ctx) { 
        if(ctx.hasOwnProperty(key) && ctx[key] instanceof clazz) {
            return ctx[key];
        }
    }
    return undefined;

};

/**
 * Sets up a mocked animation environment, since jsdom doesnt support animations
 * by default. Will add beforeEach/afterEach/after callbacks to cleanup automatically.
 *
 * The returned object contains the mocked objects and a function to call
 * tick animation forwards in time
 *
 * @usage
 *   import { mockAnimations } from "./tests/fixtures/js/svelteUtils.js";
 *   let { tickAnimations } = mockAnimations();
 *   it("should animate", async () => {
 *      await tickAnimations(500); // tick any svelte animating element forwards by 500ms
 *   });
 *
 * @return {object} mocked
 *  - {object} mocked.fakeTimers - the mocked sinon timers for progressing clock time
 *  - {sinon.stub} mocked.rafStub - the mocked requestAnimationFrame stub
 *  - {int} mocked.testStartTime - the start time used for calculating the DOMHighRestTimestamp passed to raf callbacks
 *  - {function} mocked.tickAnimations - the async function to call to tick animations forwards in time, accepts the amount of time in ms to tick forward
 */
export const mockAnimations = () => {
    // we need to test for animations, so we are going to
    // mock the timers and requestAnimationFrame
    let mocked:{
        fakeTimers:sinon.SinonFakeTimers|null,
        rafStub: sinon.SinonStub<[(now:number)=>void],any>|null,
        testStartTime: number,
        tickAnimations: (timeAmount:number) => Promise<any>
    } = {
        fakeTimers:null,
        rafStub:null,
        testStartTime:0,
        tickAnimations: () => Promise.resolve()
    };

    let origRaf = global.requestAnimationFrame;

    // to simulate animations progressing we need to tick the clock forward, process any raf callbacks
    // then call tick() to let svelte runs its updates
    mocked.tickAnimations = async function(timeAmount) {
        if(mocked.fakeTimers) { mocked.fakeTimers.tick(timeAmount); }
        if(mocked.rafStub) { callRAFCallbacks(mocked.rafStub, Date.now()); }
        await tick();
    };

    beforeEach(() => {
        mocked.fakeTimers = sinon.useFakeTimers(Date.now());
        mocked.rafStub = sinon.stub();
        global.requestAnimationFrame = mocked.rafStub;
        if(mocked.rafStub) { set_raf(mocked.rafStub); }
        mocked.testStartTime = Date.now();
    });
    afterEach(() => {
        global.requestAnimationFrame = origRaf;
        if(mocked.fakeTimers) { mocked.fakeTimers.restore(); }
    });
    after(() => {
        global.requestAnimationFrame = origRaf;
        set_raf(origRaf);
    });

    return mocked;
};
