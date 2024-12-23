import Foo from "../components/Foo.svelte";

(new Foo({
    target: document.getElementById("app") || document.body,
    props: {
    }
}));
