import { type PlayerStats as SourcePlayerStats } from "../PlayerStats";
import { COUNTING_CATS, RATE_CATS, GRAPH_CATS, SPLIT_CATS } from "../const/stats";

declare global { 

    type PlayerStats = SourcePlayerStats;

    type CountingStatCat = typeof COUNTING_CATS[number];

    type RateStatCat = typeof RATE_CATS[number];

    type GraphableStatCat = typeof GRAPH_CATS[number];

    type SplitStatCat = typeof SPLIT_CATS[number];
    
}
