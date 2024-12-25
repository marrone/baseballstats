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
        return {code: resp.status, json};
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
}

type FetchFunc = (url:string, config?:any) => Promise<any>;

type ResponseData = {
    code:number,
    json:any,
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

/**
* @class
* @classdesc
* Responsible for making requests to the backend API
*/
class DataService {

    private baseUrl:string;
    private apiKey:string;
    private token:string|null;
    private endpoints:Endpoints;
    private cache:Map<string, Promise<ResponseData>>; // url => response
    private cachedTokenReq:Promise<string> | null;
    private fetchFunc:FetchFunc;

    constructor(config:ServiceConfig) { 
        this.baseUrl = (config.apiBaseUrl || "").replace(/\/$/,'') + "/"; // ensure ends in slash
        this.apiKey = config.apiKey;
        this.token = config.token || null;

        this.endpoints = {
            token: this.baseUrl + 'token',
            players: this.baseUrl + 'mlb/players',
        };

        //this.fetchFunc = (typeof fetch !== "undefined") ? fetch : null; // polyfill https://github.com/github/fetch
        this.fetchFunc = fetch;

        this.cache = new Map<string, Promise<ResponseData>>();
        this.cachedTokenReq = null;
    }

    set fetch(val: FetchFunc) { this.fetchFunc = val; }
    get fetch():FetchFunc { return this.fetchFunc; }

    getToken():Promise<string> {
        if(this.token) { return Promise.resolve(this.token); }
        if(this.cachedTokenReq) { return this.cachedTokenReq; }
        let req = this.fetch.call(win(), this.endpoints.token, {
        //let req = this.fetch(this.endpoints.token, {
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
        if(this.cache.has(url)) {
            return this.cache.get(url)!;
        }

        let timeoutError = new Promise<never>((_, reject) => {
            setTimeout(() => {
                this.cache.delete(url);
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
                this.cache.set(url, Promise.resolve(resp));
                return resp;
            })
            .catch(err => {
                this.cache.delete(url);
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

        let resp = Promise.race<ResponseData>([request, timeoutError]);
        this.cache.set(url, resp);
        return resp;
    }

    getPlayers():Promise<PlayersResponse> {
        return this.makeRequest(this.endpoints.players)
            .then(resp => {
                if(isPlayersResponseData(resp.json)) {
                    return new PlayersResponse(resp.json, resp.code);
                }
                this.cache.delete(this.endpoints.players);
                throw new Error("Invalid players response");
            })
    }

}

/**
 * @class
 * @classdesc
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

export { ApiResponse, TokenResponse, PlayersResponse, type ServiceConfig };
export default DataService;
