import App from "../components/App.svelte";
import config from "./config";

(new App({
    target: document.getElementById("app") || document.body,
    props: {
        config 
    }
}));
