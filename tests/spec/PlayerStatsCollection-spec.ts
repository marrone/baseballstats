import { expect } from "chai";
import sinon from 'sinon';
import PlayerStats from "../../src/scripts/PlayerStats";
import PlayerStatsCollection from "../../src/scripts/PlayerStatsCollection";
import samplePlayerStats from "../fixtures/player.harper.json";

describe("PlayerStatsCollection", () => {

    it("should compute rolling avg", () => {
        let stats = samplePlayerStats.map(s => new PlayerStats(s));
        let col = new PlayerStatsCollection(stats);
        // our sample data has 3 stats records, of 4, 5, and 4 PAs
        // Computing the rolling avg on 9 PA should produce a new collection of 2 records
        let rollingAvg = col.rollingAvg(9).toArray();
        expect(rollingAvg.length).to.equal(2);
        expect(rollingAvg[0].H).to.equal(stats[0].H + stats[1].H);
        expect(rollingAvg[1].H).to.equal(stats[1].H + stats[2].H);
        expect(rollingAvg[0].AB).to.equal(stats[0].AB + stats[1].AB);
        expect(rollingAvg[1].AB).to.equal(stats[1].AB + stats[2].AB);
        // ... @TODO should test all the stats
        // date field should get updated to the latest
        expect(rollingAvg[0].date).to.equal(stats[1].date);
        expect(rollingAvg[1].date).to.equal(stats[2].date);
    });

    it("should split stats", () => {
        let stats = samplePlayerStats.map(s => new PlayerStats(s));
        let col = new PlayerStatsCollection(stats);
        // one of the records has 0 hits, so splitting on H >= 1 should produce the first 
        // collection with 1 record where he got 0 hits, and the second collection of the other 2 records
        let splitStats = col.split("H", 1);
        expect(splitStats.length).to.equal(2);
        expect(splitStats[0] instanceof PlayerStatsCollection).to.equal(true);
        expect(splitStats[1] instanceof PlayerStatsCollection).to.equal(true);
        expect(splitStats[0].toArray().length).to.equal(1);
        expect(splitStats[1].toArray().length).to.equal(2);
        expect(splitStats[0].toArray()[0].H).to.equal(0);
        expect(splitStats[1].toArray().map(s => s.H)).to.eql([3,1]);
        // splitting on 2+ should leave the second collection with just the one record
        splitStats = col.split("H", 2);
        expect(splitStats[0].toArray().length).to.equal(2)
        expect(splitStats[1].toArray().length).to.equal(1);
        expect(splitStats[1].toArray()[0].H).to.equal(3);
    });

    it("should split on boolean stats", () => {
        // bool stats like win/loss should be treated as 1 or 0 for splitting thresholds
        let stats = samplePlayerStats.map(s => new PlayerStats(s));
        let col = new PlayerStatsCollection(stats);
        let splitStats = col.split("win", 1);
        expect(splitStats[0].toArray().length).to.equal(2);
        expect(splitStats[1].toArray().length).to.equal(1);
        expect(splitStats[1].toArray()[0].win).to.equal(true);
    });

});
