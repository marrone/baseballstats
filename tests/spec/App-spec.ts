import { expect } from "chai";
import sinon from 'sinon';
import { mount, setupSvelteTests, getReferenceByPropMatch } from "../scripts/svelteUtils";
import { tick } from 'svelte';
import App from "../../src/components/App.svelte";
import sampleTokenResponse from "../fixtures/token.json";
import samplePlayersResponse from "../fixtures/players.json";
import samplePlayerStatsResponse from "../fixtures/player.harper.json";

describe("App", () => {

    setupSvelteTests();

    let fetchStub = sinon.stub();
    let origFetch = global.fetch; 
    beforeEach(() => {
        if(global.fetch != fetchStub) { 
            origFetch = global.fetch;
            global.fetch = fetchStub;
        }
    });
    afterEach(() => {
        fetchStub.reset();
    });
    after(() => {
        global.fetch = origFetch;
    });

    function mockResponse(json:object, status=200, urlMatch:string|null=null) {
        let jsonPromise = Promise.resolve({status: status, json: () => Promise.resolve(json)});
        if(urlMatch) {
            fetchStub.withArgs(sinon.match(urlMatch)).returns(jsonPromise);
        }
        else {
            fetchStub.returns(jsonPromise);
        }
        return jsonPromise;
    }

    function click(el:HTMLElement) {
        el.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
    }

    async function waitLoading(appState:{loading:boolean}) {
        while(appState.loading) {
            await tick();
        }
    }

    it("can render charts", async () => {
        mockResponse(sampleTokenResponse, 200, "/api/token");
        mockResponse(samplePlayersResponse, 200, "/api/mlb/players");
        mockResponse(samplePlayerStatsResponse, 200, "/api/mlb/player/" + samplePlayersResponse[0].playerId);
        mockResponse(samplePlayerStatsResponse);

        let svelteComp = mount(App, {config: {apiBaseUrl: "/api", apiKey: "abc123"}});
        let appState = getReferenceByPropMatch(svelteComp, ["loading", "selectedPlayerIds"]);
        await waitLoading(appState);

        // basic page layout should have rendered
        expect(document.querySelector('#main'), '#main').not.to.be.null;
        // the player select button should bt there as well
        let addPlayerBtn = document.querySelector('.add-player-btn');
        expect(addPlayerBtn, 'addPlayerBtn').not.to.be.null;

        // clicking the player select button should launch the player select dialog
        click(addPlayerBtn as HTMLElement);
        await tick();
        expect(document.querySelector('dialog .players'), 'player select').not.to.be.null;

        // select the first player
        click(document.querySelector('dialog .players input[value="' + samplePlayersResponse[0].playerId + '"]') as HTMLElement);
        await tick(); // allow the event to fire
        await waitLoading(appState);
        await tick(); // alow svelte to re-render

        // stats should have been fetched
        expect(appState.playerStats.length).to.equal(1);
        expect(appState.playerStats[0].toArray()).to.eql(samplePlayerStatsResponse);
    });

});
