import { expect } from "chai";
import sinon from 'sinon';
import PlayerStats from "../../src/scripts/PlayerStats";
import samplePlayerStats from "../fixtures/player.harper.json";

describe("PlayerStats", () => {
    
    it("should calculate rate stats", () => {
        [
            [0, 0, 0, 0],
            [1.0, 1.333, 1.0, 2.333],
            [.25, .25, .25, .5],
        ].forEach((results, i) => {
            let stats = new PlayerStats(samplePlayerStats[i]);
            expect(stats.AVG).to.be.closeTo(results[0], .001, "AVG");
            expect(stats.SLG).to.be.closeTo(results[1], .001, "SLG");
            expect(stats.OBP).to.be.closeTo(results[2], .001, "OBP");
            expect(stats.OPS).to.be.closeTo(results[3], .001, "OPS");
        });
    });

});
