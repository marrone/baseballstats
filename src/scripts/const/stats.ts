export const COUNTING_CATS = ["PA", "AB", "H", "HR", "BB", "K", "HBP", "SF", "TB", "RBI"] as const;
export const RATE_CATS = ["AVG", "OPS", "OBP", "SLG"] as const;
export const GRAPH_CATS = [...COUNTING_CATS, ...RATE_CATS] as const;
