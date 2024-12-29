/**
 * A caching class. stores in memory and local stroage to avoid unnecessary requests to the API
 */
class Cache<T> {

    private cache: Map<string, T>;
    private cacheGuard: ((obj:any) => obj is T) | undefined;

    constructor(cacheGuard?: (obj:any) => obj is T) {
        this.cache = new Map<string, T>();
        this.cacheGuard = cacheGuard;
    }

    set(key:string, val:T) {
        this.cache.set(key, val);
        try {
            if(this.cacheGuard) { localStorage.setItem(key, JSON.stringify(val)); }
        } catch(err) {} // eslint-disable-line @typescript-eslint/no-unused-vars
    }

    private getFromStorage(key:string):T | undefined {
        // try storage
        // @TODO this can be removed, useful while dev'ing to avoid a bunch of requests
        // but we will likely max out storage due to the amount of data that can be fetched
        try { 
            if(this.cacheGuard) { 
                let json = localStorage.getItem(key);
                if(json) {
                    let obj = JSON.parse(json);
                    if(this.cacheGuard(obj)) {
                        this.cache.set(key, obj);
                        return obj;
                    }
                }
            }
        } catch(err) {} // eslint-disable-line @typescript-eslint/no-unused-vars
    }

    get(key:string):T | undefined {
        // try in-memory first
        if(this.cache.has(key)) { return this.cache.get(key); }
        return this.getFromStorage(key);
    }

    has(key:string):boolean {
        if(!this.cache.has(key)) {
            this.getFromStorage(key);
        }
        return this.cache.has(key);
    }

    delete(key:string) {
        this.cache.delete(key);
        try {
            if(this.cacheGuard) { localStorage.deleteItem(key); }
        } catch(err) {} // eslint-disable-line @typescript-eslint/no-unused-vars
    }

}

export default Cache;
