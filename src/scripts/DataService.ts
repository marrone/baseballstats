/**
 * This modules defines the DataService class for making requests tot he API
 * as well as the response classes defining each type of api response
 */

import Cache from "./Cache";

function checkStatus(response:Response) {
    //console.log("checkStatus", response, arguments);
    if(response.status >= 200 && response.status < 500) {
        return response;
    } 
    else {
        var error = new ErrorResponse(response.statusText);
        error.response = response;
        return parseJson(response).then(({code, json}) => {
            error.response = new ApiResponse(json, code);
            throw error;
        }).catch(() => {
            throw error;
        });
    }
}

function parseJson(resp:Response):Promise<ResponseData> { 
    return resp.json().then((json:any) => {
        return {url: resp.url, code: resp.status, json};
    });
}

function win() {
    return (typeof window !== "undefined") ? window : null;
}

type ServiceConfig = {
    // the base url to make requests to
    apiBaseUrl: string,
    // our personal api key
    apiKey: string
    // optionally seed the token, otherwise it will need to be fetched using our apiKey
    token?: string,
}

type Endpoints = {
    token:string,
    players:string,
    playerStats:string,
}

type FetchFunc = (url:string, config?:any) => Promise<any>;

type ResponseData = {
    url:string,
    code:number,
    json:any,
}

function isResponseData(obj:any): obj is ResponseData {
    return !!(obj && obj.code && obj.json && obj.url);
}

type TokenResponseData = {
    token:string,
    expires:string,
}

function isTokenResponseData(obj:any): obj is TokenResponseData {
    return !!(obj && obj.token !== undefined);
}

type PlayersResponseData = {
    playerId: number,
    playerFullName: string,
    // url to player photo image
    playerImage: string,
    // url to team logo image
    teamImage: string,
}

function isPlayersResponseData(obj:any): obj is PlayersResponseData[] {
    return !!(Array.isArray(obj) && obj[0]?.playerId && obj[0]?.playerFullName);
}

class ErrorResponse extends Error {
    public response:Response | ApiResponse | null = null;
}

type PlayerStatsResponseData = {
    playerId: number,
    abbrevName: string,
    playerFullName: string,
    player: string,
    pos: string,
    currentTeamName: string,
    currentTeamAbbrevName: string,
    currentTeamId: number,
    currentTeamLocation: string,
    currentTeamLevel: string,
    currentOrg: string,
    newestTeamName: string,
    newestTeamAbbrevName: string,
    newestTeamId: number,
    newestTeamLocation: string,
    newestTeamLevel: string,
    newestOrg: string,
    batsHand: string,
    throwsHand: string,
    PA: number,
    AB: number,
    H: number,
    HR: number,
    BB: number,
    K: number,
    HBP: number,
    SF: number,
    TB: number,
    RBI: number,
    gameId: number,
    opponentId: number,
    opponentToken: string,
    opponent: string,
    date: string,
    result: string,
    win: boolean,
    home: boolean,
    away: boolean,
    playerImage: string,
    teamImage: string,
    oppImage: string
}

function isPlayerStatsResponse(obj:any): obj is PlayerStatsResponseData[] {
    return !!(Array.isArray(obj) && obj[0]?.playerId && obj[0]?.gameId);
}

/**
* Responsible for making requests to the backend API
*/
class DataService {

    private baseUrl:string;
    private apiKey:string;
    private token:string|null;
    private endpoints:Endpoints;
    private requestCache:Cache<Promise<ResponseData>>; 
    private responseCache:Cache<ResponseData>; 
    private cachedTokenReq:Promise<string> | null;
    private fetchFunc:FetchFunc;

    constructor(config:ServiceConfig) { 
        this.baseUrl = (config.apiBaseUrl || "").replace(/\/$/,'') + "/"; // ensure ends in slash
        this.apiKey = config.apiKey;
        this.token = config.token || null;

        this.endpoints = {
            token: this.baseUrl + 'token',
            players: this.baseUrl + 'mlb/players',
            playerStats: this.baseUrl + 'mlb/player/{id}',
        };

        //this.fetchFunc = (typeof fetch !== "undefined") ? fetch : null; // polyfill https://github.com/github/fetch
        this.fetchFunc = fetch;

        this.requestCache = new Cache<Promise<ResponseData>>();
        this.responseCache = new Cache<ResponseData>(isResponseData);
        this.cachedTokenReq = null;
    }

    set fetch(val: FetchFunc) { this.fetchFunc = val; }
    get fetch():FetchFunc { return this.fetchFunc; }

    getToken():Promise<string> {
        if(this.token) { return Promise.resolve(this.token); }
        if(this.cachedTokenReq) { return this.cachedTokenReq; }
        let req = this.fetch.call(win(), this.endpoints.token, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'accept': 'application/json',
                'apiKey': this.apiKey,
            }
        }).then(checkStatus)
          .then(parseJson)
          .then(resp => {
              if(isTokenResponseData(resp.json)) {
                  return new TokenResponse(resp.json, resp.code);
              }
              throw new Error("Invalid token response");
          })
          .then(tokenResp => {
              this.token = tokenResp.token;
              return this.token;
          });

        this.cachedTokenReq = req;
        return req;
    }

    private makeRequest(url:string, maxRetries:number=2, timeout:number=10000):Promise<ResponseData> {
        if(this.requestCache.has(url)) { return this.requestCache.get(url)!; }
        if(this.responseCache.has(url)) { return Promise.resolve(this.responseCache.get(url)!); }

        let timeoutError = new Promise<never>((_, reject) => {
            setTimeout(() => {
                this.requestCache.delete(url);
                reject(new Error("Timed out"));
            }, timeout);
        });

        let request:Promise<ResponseData> = this.getToken().then(token => {
            return this.fetch.call(win(), url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'tempToken': this.token,
                }
            })
            .then(checkStatus)
            .then(parseJson)
            .then((resp:ResponseData) => {
                this.responseCache.set(url, resp);
                return resp;
            })
            .catch(err => {
                this.requestCache.delete(url);
                if(err instanceof ErrorResponse 
                && err.response instanceof ApiResponse
                && err.response.statusCode === 401) {
                    // token has expired or is no longer valid
                    // re-try if we have attempts left
                    this.token = null;
                    if(maxRetries > 0) {
                        return this.makeRequest(url, maxRetries - 1, timeout);
                    }
                }
                throw err;
            });
        });

        let req = Promise.race<ResponseData>([request, timeoutError]);
        this.requestCache.set(url, req);
        return req;
    }

    private deleteCache(url:string) {
        this.requestCache.delete(url);
        this.responseCache.delete(url);
    }

    getPlayers():Promise<PlayersResponse> {
        return this.makeRequest(this.endpoints.players)
            .then(resp => {
                if(isPlayersResponseData(resp.json)) {
                    return new PlayersResponse(resp.json, resp.code);
                }
                this.deleteCache(resp.url);
                throw new Error("Invalid players response");
            });
    }

    getPlayerStats(id:number):Promise<PlayerStatsResponse> {
        return this.makeRequest(this.endpoints.playerStats.replace('{id}', ""+id))
            .then(resp => {
                if(isPlayerStatsResponse(resp.json)) {
                    return new PlayerStatsResponse(resp.json, resp.code);
                }
                this.deleteCache(resp.url);
                throw new Error("Invalid player stats response");
            });
    }
}

/**
 * base class representation of the api response
 */
class ApiResponse {

    protected responseCode:number;
    protected responseData:any;
    protected requestData:any;

    constructor(data:any, code:number=200, reqData?:any) {
        this.responseCode = code;
        this.responseData = data;
        this.requestData = reqData;
    }

    get statusCode():number { return this.responseCode; }

    get data():any { return this.responseData; }
    set data(val:any) { this.responseData = val; }

    get isError():boolean {
        return this.responseCode >= 400 || !!this.data?.error;
    }
}

class TokenResponse extends ApiResponse {

    constructor(data:TokenResponseData, code:number=200, reqData?:any) {
        super(data, code, reqData);
    }

    get token():string {
        return this.responseData.token;
    }
}

class PlayersResponse extends ApiResponse {

    constructor(data:PlayersResponseData[], code:number=200, reqData?:any) {
        super(data, code, reqData);
    }

    get players():PlayersResponseData[] {
        return this.responseData;
    }
}

class PlayerStatsResponse extends ApiResponse {

    constructor(data:PlayerStatsResponseData[], code:number=200, reqData?:any) {
        super(data, code, reqData);
    }

    get stats():PlayerStatsResponseData[] {
        return this.responseData;
    }
}

export { 
    DataService,
    type ServiceConfig,
    ApiResponse, 
    TokenResponse, 
    PlayersResponse, 
    PlayerStatsResponse, 
    type PlayersResponseData,
    type PlayerStatsResponseData,
};
export default DataService;
