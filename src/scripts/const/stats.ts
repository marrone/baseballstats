export const COUNTING_CATS = ["PA", "AB", "H", "HR", "BB", "K", "HBP", "SF", "TB", "RBI"] as const;
export const RATE_CATS = ["AVG", "OPS", "OBP", "SLG"] as const;
export const GRAPH_CATS = [...COUNTING_CATS, ...RATE_CATS] as const;
export const SPLIT_CATS = [...GRAPH_CATS, "win", "home"] as const;
