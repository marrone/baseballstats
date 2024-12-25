<script lang="ts">
    import { type AppConfig } from "../scripts/config";
    export let config:AppConfig;

    import DataService, { PlayersResponse } from "../scripts/DataService";
    import Page from "./Page.svelte";
    import { type Player } from "../scripts/types";

    let dataService = new DataService(config);
    let viewModel: {
        loading:boolean,
        players:Player[] | null,
    } = {   
        loading: true,
        players: null,
    };

    dataService.getPlayers().then(resp => {
        viewModel.loading = false;
        viewModel.players = resp.players;
    }).catch(err => {
        console.log(err);
        alert("Sorry, an error occurred. Please try again later");
    });

</script>

<Page {...viewModel} />
