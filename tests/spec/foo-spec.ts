import { expect } from "chai";
import { mount, setupSvelteTests } from "../scripts/svelteUtils";
import { tick } from 'svelte';
import FooComponent from "../../src/components/Foo.svelte";

describe("sanity test", () => {

    setupSvelteTests();

    it("should just work", () => {
        expect(true).to.equal(true);
    });

    it("can instantiate component", async () => {
        mount(FooComponent, {name: 'Everyone'});
        await tick(); // wait for svelte to render
        let node = document.querySelector('p');
        expect(node).not.to.be.null;
        expect(node?.innerHTML).to.equal('Hello Everyone!');
    });

    it("can handle dom events", async () => {
        mount(FooComponent, {name: 'Everyone'});
        await tick(); // wait for svelte to render
        let btnNode = document.querySelector('button');
        expect(btnNode).not.to.be.null;
        btnNode!.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
        await tick();
        expect(btnNode?.innerHTML).to.equal('Click Moi');
    });

});
