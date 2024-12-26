import { type PlayerStats as SourcePlayerStats } from "../PlayerStats";
import { COUNTING_CATS, RATE_CATS, GRAPH_CATS } from "../const/stats";

declare global { 

    type PlayerStats = SourcePlayerStats;

    type CountingStatCat = typeof COUNTING_CATS[number];

    type RateStatCat = typeof RATE_CATS[number];

    type GraphableStatCat = typeof GRAPH_CATS[number];
    
}

export { 
    type PlayerStats, 
    type CountingStatCat, 
    type RateStatCat,
    type GraphableStat,
};
