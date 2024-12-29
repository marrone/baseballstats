import { COUNTING_CATS } from "./const/stats";
import PlayerStats from "./PlayerStats";

class PlayerStatsCollection {

    private stats:PlayerStats[];

    constructor(stats:PlayerStats[]) {
        this.stats = stats;
    }

    private add(dest:PlayerStats, src:PlayerStats) {
        COUNTING_CATS.forEach(cat => {
            dest[cat] += src[cat];
        });
        dest.date = src.date;
    }

    private subtract(dest:PlayerStats, src:PlayerStats) {
        COUNTING_CATS.forEach(cat => {
            dest[cat] -= src[cat];
        });
    }

    /**
     * Compute the rolling average of the stats for the given plate attempts total
     */
    rollingAvg(plateAttempts:number):PlayerStatsCollection {
        let avgStats:PlayerStats[] = [];
        if(this.stats.length == 0) { return new PlayerStatsCollection(avgStats); }

        // get the initial data set
        let sumStats:PlayerStats = new PlayerStats(this.stats[0]);
        let i = 1;
        for(; i < this.stats.length && sumStats.PA < plateAttempts; i++) {
            this.add(sumStats, this.stats[i]);
        }
        avgStats.push(sumStats);

        // compute the rolling avg
        let left = 0, right = i;
        while(right < this.stats.length) {
            sumStats = new PlayerStats(sumStats); // get a copy, we are going to modify it
            // remove the first stats
            while(sumStats.PA >= plateAttempts) { 
                this.subtract(sumStats, this.stats[left]);
                left++;
            }
            // add the new stats to get back to the target PA
            while(sumStats.PA < plateAttempts && right < this.stats.length) {
                this.add(sumStats, this.stats[right]);
                right++;
            }
            avgStats.push(sumStats);
        }

        return new PlayerStatsCollection(avgStats);
    }

    /**
     * Splits the stats given a stat and the boundary value. Returns two collections,
     * the first is every game where the stat was below the boundary value,
     * and the second is every game where the stats was >= the value
     */
    split(stat:SplitStatCat, splitVal:number):[PlayerStatsCollection, PlayerStatsCollection] {
        let splitStats:[PlayerStats[], PlayerStats[]] = [[], []];
        for(let stats of this.stats) {
            let val = Number(stats[stat]);
            splitStats[val < splitVal ? 0 : 1].push(stats);
        }
        return [new PlayerStatsCollection(splitStats[0]), new PlayerStatsCollection(splitStats[1])];
    }

    toArray() { return this.stats; }

}

export default PlayerStatsCollection;
