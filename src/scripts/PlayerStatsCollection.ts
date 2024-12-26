import { COUNTING_CATS } from "./const/stats";
import PlayerStats from "./PlayerStats";

class PlayerStatsCollection {

    private stats:PlayerStats[];

    private overwriteProps = ["gameId", "opponentId", "opponentToken",] as const;

    constructor(stats:PlayerStats[]) {
        this.stats = stats;
    }

    private add(dest:PlayerStats, src:PlayerStats) {
        COUNTING_CATS.forEach(cat => {
            dest[cat] += src[cat];
        });
        /*
        this.overwriteProps.forEach(prop => {
            dest[prop] = src[prop];
        });
        */
       dest.date = src.date;
    }

    private subtract(dest:PlayerStats, src:PlayerStats) {
        COUNTING_CATS.forEach(cat => {
            dest[cat] -= src[cat];
        });
    }

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

    toArray() { return this.stats; }

}

export default PlayerStatsCollection;
