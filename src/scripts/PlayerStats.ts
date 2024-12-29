import { type PlayerStatsResponseData } from "./DataService";

class PlayerStats {

    public playerId: number;
    public abbrevName: string;
    public playerFullName: string;
    public player: string;
    public pos: string;
    public currentTeamName: string;
    public currentTeamAbbrevName: string;
    public currentTeamId: number;
    public currentTeamLocation: string;
    public currentTeamLevel: string;
    public currentOrg: string;
    public newestTeamName: string;
    public newestTeamAbbrevName: string;
    public newestTeamId: number;
    public newestTeamLocation: string;
    public newestTeamLevel: string;
    public newestOrg: string;
    public batsHand: string;
    public throwsHand: string;
    public PA: number;
    public AB: number;
    public H: number;
    public HR: number;
    public BB: number;
    public K: number;
    public HBP: number;
    public SF: number;
    public TB: number;
    public RBI: number;
    public gameId: number;
    public opponentId: number;
    public opponentToken: string;
    public opponent: string;
    public date: string;
    public result: string;
    public win: boolean;
    public home: boolean;
    public away: boolean;
    public playerImage: string;
    public teamImage: string;
    public oppImage: string;

    constructor(data: PlayerStatsResponseData) {
        this.playerId = data.playerId;
        this.abbrevName = data.abbrevName;
        this.playerFullName = data.playerFullName;
        this.player = data.player;
        this.pos = data.pos;
        this.currentTeamName = data.currentTeamName;
        this.currentTeamAbbrevName = data.currentTeamAbbrevName;
        this.currentTeamId = data.currentTeamId;
        this.currentTeamLocation = data.currentTeamLocation;
        this.currentTeamLevel = data.currentTeamLevel;
        this.currentOrg = data.currentOrg;
        this.newestTeamName = data.newestTeamName;
        this.newestTeamAbbrevName = data.newestTeamAbbrevName;
        this.newestTeamId = data.newestTeamId;
        this.newestTeamLocation = data.newestTeamLocation;
        this.newestTeamLevel = data.newestTeamLevel;
        this.newestOrg = data.newestOrg;
        this.batsHand = data.batsHand;
        this.throwsHand = data.throwsHand;
        this.PA = data.PA;
        this.AB = data.AB;
        this.H = data.H;
        this.HR = data.HR;
        this.BB = data.BB;
        this.K = data.K;
        this.HBP = data.HBP;
        this.SF = data.SF;
        this.TB = data.TB;
        this.RBI = data.RBI;
        this.gameId = data.gameId;
        this.opponentId = data.opponentId;
        this.opponentToken = data.opponentToken;
        this.opponent = data.opponent;
        this.date = data.date;
        this.result = data.result;
        this.win = data.win;
        this.home = data.home;
        this.away = data.away;
        this.playerImage = data.playerImage;
        this.teamImage = data.teamImage;
        this.oppImage = data.oppImage;
    }

    /**
     * A unique key for this instance
     */
    get uid():string {
        return `${this.playerId}-${this.date}`;
    }

    get AVG():number {
        return this.H / this.AB;
    }

    get OPS():number {
        return this.OBP + this.SLG;
    }

    get OBP():number {
        return (this.H + this.BB + this.HBP) / (this.AB + this.BB + this.SF + this.HBP);
    }

    get SLG():number {
        return this.TB / this.AB;
    }
}

export default PlayerStats;
