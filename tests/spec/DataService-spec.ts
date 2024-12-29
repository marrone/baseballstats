import { expect } from "chai";
import sinon from 'sinon';
import DataService, { 
    TokenResponse, 
    PlayersResponse, 
    PlayerStatsResponse, 
    type PlayersResponseData,
    type PlayerStatsResponseData
} from "../../src/scripts/DataService";
import sampleTokenResponse from "../fixtures/token.json";
import samplePlayersResponse from "../fixtures/players.json";
import samplePlayerStatsResponse from "../fixtures/player.harper.json";

describe("DataService", () => {

    let fetchStub = sinon.stub();
    const serviceConfig = {apiBaseUrl:"/api", apiKey:"abc123"};
    let service = new DataService(serviceConfig);

    beforeEach(() => {
        service = new DataService(serviceConfig);
        service.fetch = fetchStub;
    });
    afterEach(() => {
        fetchStub.reset();
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

    it("makes get token requests", async () => {
        mockResponse(sampleTokenResponse);
        let token = await service.getToken();
        expect(fetchStub).calledOnce;
        let args = fetchStub.getCall(0).args;
        expect(args[0].startsWith(service.endpoints.token), "url matching").to.equal(true);
        expect(args[1].method).to.equal('GET');
        expect(args[1].headers['apiKey']).to.equal(serviceConfig.apiKey);
        expect(token).to.equal(sampleTokenResponse.token);
        expect(service.tempToken).to.equal(sampleTokenResponse.token);
    });

    it("makes players requests", async () => {
        mockResponse(sampleTokenResponse, 200, service.endpoints.token);
        mockResponse(samplePlayersResponse, 200, service.endpoints.players);
        let playersResp = await service.getPlayers();
        // it should have first fetched the token, since we didnt provide one
        expect(fetchStub).calledTwice;
        let args = fetchStub.getCall(0).args;
        expect(args[0].startsWith(service.endpoints.token), "url matching").to.equal(true);
        expect(service.tempToken).to.equal(sampleTokenResponse.token);
        // next call once we had the token should be to the players
        args = fetchStub.getCall(1).args;
        expect(args[0].startsWith(service.endpoints.players), "url matching").to.equal(true);
        expect(args[1].headers["tempToken"]).to.equal(sampleTokenResponse.token);
        expect(playersResp instanceof PlayersResponse).to.equal(true);
        let players = playersResp.players;
        expect(Array.isArray(players)).to.equal(true);
        expect(players).to.eql(samplePlayersResponse);
    });

    it("makes player stats request", async () => {
        let playerId = samplePlayerStatsResponse[0].playerId;
        mockResponse(sampleTokenResponse, 200, service.endpoints.token);
        mockResponse(samplePlayerStatsResponse, 200, service.endpoints.playerStats.replace('{id}',""+playerId));
        let playerStatsResp = await service.getPlayerStats(playerId);
        // it should have first fetched the token, since we didnt provide one
        expect(fetchStub).calledTwice;
        let args = fetchStub.getCall(0).args;
        expect(args[0].startsWith(service.endpoints.token), "url matching").to.equal(true);
        expect(service.tempToken).to.equal(sampleTokenResponse.token);
        // next call once we had the token should be to the players
        args = fetchStub.getCall(1).args;
        expect(args[0].startsWith(service.endpoints.playerStats.replace('{id}', ""+playerId)), "url matching").to.equal(true);
        expect(args[1].headers["tempToken"]).to.equal(sampleTokenResponse.token);
        expect(playerStatsResp instanceof PlayerStatsResponse).to.equal(true);
        let playerStats = playerStatsResp.stats;
        expect(Array.isArray(playerStats)).to.equal(true);
        expect(playerStats).to.eql(samplePlayerStatsResponse);
    });

});
