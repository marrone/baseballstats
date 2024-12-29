/**
 * This module defines the actions/events that can be published by the UI
 */

import { EVENT_NAMES as EV } from "./const/events";

type Action = 
    | {type: EV.PA_COUNT_CHANGE, payload: {paCount: number}}
    | {type: EV.PLAYER_CHANGE, payload: {playerId: number, playerIndex:number}}
    | {type: EV.PLAYER_SELECT, payload: {index: number}}
    | {type: EV.PLAYER_SELECT_DISMISS}
    | {type: EV.STAT_CAT_CHANGE, payload: {stat: GraphableStatCat}}
    | {type: EV.SPLIT_STAT_CHANGE, payload: {stat: SplitStatCat | null, splitVal:number}}
    | {type: EV.ERROR, payload: {error: Error}}
    ;

type PayloadAction = Extract<Action, {payload:any}>;
type PayloadEvent = PayloadAction["type"];
type Payload<T extends PayloadEvent> = Extract<Action, {type:T}> extends {payload: infer P} ? P : never;
type NonPayloadAction = Exclude<Action, {payload:any}>;
type NonPayloadEvent = NonPayloadAction["type"];

function isPayloadEvent(type:EV): type is PayloadEvent {
    return true;
}
function createAction<T extends PayloadEvent>(type: T): (payload: Payload<T>) => Extract<Action, {type:T}>;
function createAction<T extends NonPayloadEvent>(type: T): () => Extract<Action, {type:T}>;
function createAction<T extends EV, U extends PayloadEvent>(type: T) {
    if(isPayloadEvent(type)) {
        return (payload: Payload<typeof type>) => ({type, payload});
    }
    return () => ({type});
}

// action generator functions
export const createPACountChangeAction = createAction(EV.PA_COUNT_CHANGE);
export const createPlayerChangeAction = createAction(EV.PLAYER_CHANGE);
export const createPlayerSelectAction = createAction(EV.PLAYER_SELECT);
export const createPlayerSelectDismissAction = createAction(EV.PLAYER_SELECT_DISMISS);
export const createStatCatChangeAction = createAction(EV.STAT_CAT_CHANGE);
export const createSplitStatChangeAction = createAction(EV.SPLIT_STAT_CHANGE);
export const createErrorAction = createAction(EV.ERROR);

export { 
    type Action,
    type PayloadAction,
    type PayloadEvent,
    type Payload,
    type NonPayloadAction,
    type NonPayloadEvent,
};
