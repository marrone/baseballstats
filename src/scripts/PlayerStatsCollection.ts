class PlayerStatsCollection {

    private stats:PlayerStats[];

    private countingCats = ["PA", "AB", "H", "HR", "BB", "K", "HBP", "SF", "TB", "RBI"] as const;

    constructor(stats:PlayerStats[]) {
        this.stats = stats;
    }

    private add(dest:PlayerStats, src:PlayerStats) {
        this.countingCats.forEach(cat => {
            dest[cat] += src[cat];
        });
    }

    private subtract(dest:PlayerStats, src:PlayerStats) {
        this.countingCats.forEach(cat => {
            dest[cat] -= src[cat];
        });
    }

    rollingAvg(plateAttemps:number):PlayerStatsCollection {
        let avgStats:PlayerStats[] = [];
        if(this.stats.length == 0) { return new PlayerStatsCollection(avgStats); }

        // get the initial data set
        let sumStats:PlayerStats = {...this.stats[0]};
        let i = 1;
        for(; i < this.stats.length && sumStats.PA < plateAttemps; i++) {
            this.add(sumStats, this.stats[i]);
        }
        avgStats.push(sumStats);

        // compute the rolling avg
        let left = 0, right = i;
        while(right < this.stats.length) {
            sumStats = {...sumStats}; // get a copy, we are going to modify it
            // remove the first stats
            while(sumStats.PA > plateAttemps) { 
                this.subtract(sumStats, this.stats[left]);
                left++;
            }
            // add the new stats to get back to the target PA
            while(sumStats.PA < plateAttemps && right < this.stats.length) {
                this.add(sumStats, this.stats[right]);
                right++;
            }
            avgStats.push(sumStats);
        }

        return new PlayerStatsCollection(avgStats);
    }

}

export default PlayerStatsCollection;
