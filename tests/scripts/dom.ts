/** @module dom **/

import jsdom from 'jsdom';

// global jsdom setup take from this package
// https://github.com/rstacruz/jsdom-global/blob/master/index.js
// but it is no longer supported, instead we are maintaining our
// own copy here
// See jsdom's lib/jsdom/living/index.js
let LIVING_KEYS = [
    'DOMException',
    'NamedNodeMap',
    'Attr',
    'Node',
    'Element',
    'DocumentFragment',
    'HTMLDocument',
    'Document',
    'CharacterData',
    'Comment',
    'DocumentType',
    'DOMImplementation',
    'ProcessingInstruction',
    'Image',
    'Text',
    'Event',
    'CustomEvent',
    'MessageEvent',
    'ErrorEvent',
    'HashChangeEvent',
    'PopStateEvent',
    'UIEvent',
    'MouseEvent',
    'KeyboardEvent',
    'TouchEvent',
    'ProgressEvent',
    'EventTarget',
    'Location',
    'History',
    'HTMLElement',
    'HTMLAnchorElement',
    'HTMLAppletElement',
    'HTMLAreaElement',
    'HTMLAudioElement',
    'HTMLBaseElement',
    'HTMLBodyElement',
    'HTMLBRElement',
    'HTMLButtonElement',
    'HTMLCanvasElement',
    'HTMLDataElement',
    'HTMLDataListElement',
    'HTMLDialogElement',
    'HTMLDirectoryElement',
    'HTMLDivElement',
    'HTMLDListElement',
    'HTMLEmbedElement',
    'HTMLFieldSetElement',
    'HTMLFontElement',
    'HTMLFormElement',
    'HTMLFrameElement',
    'HTMLFrameSetElement',
    'HTMLHeadingElement',
    'HTMLHeadElement',
    'HTMLHRElement',
    'HTMLHtmlElement',
    'HTMLIFrameElement',
    'HTMLImageElement',
    'HTMLInputElement',
    'HTMLLabelElement',
    'HTMLLegendElement',
    'HTMLLIElement',
    'HTMLLinkElement',
    'HTMLMapElement',
    'HTMLMediaElement',
    'HTMLMenuElement',
    'HTMLMetaElement',
    'HTMLMeterElement',
    'HTMLModElement',
    'HTMLObjectElement',
    'HTMLOListElement',
    'HTMLOptGroupElement',
    'HTMLOptionElement',
    'HTMLOutputElement',
    'HTMLParagraphElement',
    'HTMLParamElement',
    'HTMLPreElement',
    'HTMLProgressElement',
    'HTMLQuoteElement',
    'HTMLScriptElement',
    'HTMLSelectElement',
    'HTMLSourceElement',
    'HTMLSpanElement',
    'HTMLStyleElement',
    'HTMLTableCaptionElement',
    'HTMLTableCellElement',
    'HTMLTableColElement',
    'HTMLTableDataCellElement',
    'HTMLTableElement',
    'HTMLTableHeaderCellElement',
    'HTMLTimeElement',
    'HTMLTitleElement',
    'HTMLTableRowElement',
    'HTMLTableSectionElement',
    'HTMLTemplateElement',
    'HTMLTextAreaElement',
    'HTMLTrackElement',
    'HTMLUListElement',
    'HTMLUnknownElement',
    'HTMLVideoElement',
    'StyleSheet',
    'MediaList',
    'CSSStyleSheet',
    'CSSRule',
    'CSSStyleRule',
    'CSSMediaRule',
    'CSSImportRule',
    'CSSStyleDeclaration',
    'StyleSheetList',
    'XPathException',
    'XPathExpression',
    'XPathResult',
    'XPathEvaluator',
    'HTMLCollection',
    'NodeFilter',
    'NodeIterator',
    'NodeList',
    'Blob',
    'File',
    'FileList',
    'FormData',
    'XMLHttpRequest',
    'XMLHttpRequestEventTarget',
    'XMLHttpRequestUpload',
    'DOMTokenList',
    'URL'
];

let OTHER_KEYS = [
    'addEventListener',
    'alert',
    'atob',
    'blur',
    'btoa',
    'close',
    'confirm',
    'createPopup',
    'dispatchEvent',
    'document',
    'focus',
    'frames',
    'getComputedStyle',
    'history',
    'innerHeight',
    'innerWidth',
    'length',
    'location',
    'moveBy',
    'moveTo',
    'name',
    'navigator',
    'open',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'parent',
    'postMessage',
    'print',
    'prompt',
    'removeEventListener',
    'resizeBy',
    'resizeTo',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scroll',
    'scrollBy',
    'scrollLeft',
    'scrollTo',
    'scrollTop',
    'scrollX',
    'scrollY',
    'self',
    'stop',
    'top',
    'window'
];

let KEYS = LIVING_KEYS.concat(OTHER_KEYS);
let docDestroy = () => {};
const DEFAULT_HTML = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';

function globalJsdom(html?:string, options?:any, polyfills?:any, preserveGlobals?:string[]) {
    if(html === undefined) { html = DEFAULT_HTML; }
    if(options === undefined) { options = {}; }
    let opts = Object.assign({}, options);

    // Idempotency
    if(global.navigator &&
       global.navigator.userAgent &&
       global.navigator.userAgent.indexOf('Node.js') > -1 &&
       global.document) {
        return docDestroy;
    }

    let document = new jsdom.JSDOM(html, opts);
    let window = document.window;

    if(polyfills) {
        for(let polykey in polyfills) {
            if(polyfills.hasOwnProperty(polykey)) {
                window[polykey] = polyfills[polykey];
            }
        }
    }

    let dontDelete:any = {};
    if(preserveGlobals) {
        preserveGlobals.forEach(k => dontDelete[k] = true);
    }

    KEYS.forEach(function (key) {
        // @ts-ignore: TS7053
        global[key] = window[key];
    })

    globalThis.document = window.document;
    //globalThis.window = window;
    window.console = global.console;
    docDestroy = cleanup;

    function cleanup () {
        window.close(); //https://github.com/jsdom/jsdom#closing-down-a-jsdom
        KEYS.forEach(function (key) { 
            if(!dontDelete[key]) { 
                // @ts-ignore: TS7053
                delete global[key] 
            }
        });
        if(polyfills) {
            for(let polykey in polyfills) {
                if(!dontDelete[polykey] && polyfills.hasOwnProperty(polykey)) {
                    // @ts-ignore: TS7053
                    delete global[polykey];
                }
            }
        }
    }

    return cleanup;
}

/**
* Setup a DOM
*
* Call this inside your test suite before any tests
*
* @param {string} [html] - optional html to setup the document with
* @param {object} [options] - optional additional settings to pass
* @param {object} [polyfills] - optional additional polyfills to attach to the window/global object
* @param {string[]} [preserveGlobals] - optional keys of globals (from those that are defined by jsdom) that should be preserved and not deleted on cleanup
*
* @see https://github.com/jsdom/jsdom#simple-options
*
* @example
* import { setupDOM, createElement } from "@pch/unittest-dom";
* describe("my html tests", () => {
*   setupDOM();
*
*   test("some html test", () => {
*       // .. DOM API is now available, eg. document.querySelector, document.createElement, etc
*   });
* });
*
* @example
* import { setupDOM } from "@pch/unittest-dom";
* import atobPolyfill from "atob";
* describe("my polyfilled tests", () => {
*    // node doesnt have an atob function like browsers, so we will polyfill it
*   setupDom("<html><body></body></html>", {}, {atob: atobPolyfill});
* });
*/
function setupDOM(html:string|undefined, options?:any, polyfills?:any, preserveGlobals?:string[]) {
    //mock a browser env with full DOM api
    before(function() {
        // load and setup jsdom env
        this.jsdomCleanup = globalJsdom(html, options, polyfills, preserveGlobals);
    });
    after(function() {
        this.jsdomCleanup(); // clean up after jsdom
    });
}

export { setupDOM };
