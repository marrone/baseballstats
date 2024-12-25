import { EVENT_NAMES as EV } from "./const/events";

type Action = 
    | {type: EV.PLAYER_CHANGE, payload: {playerId: number}}
    | {type: EV.ERROR, payload: {error: Error}}
    | {type: EV.ERROR_DISMISSED}
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

export const createPlayerChangeAction = createAction(EV.PLAYER_CHANGE);
export const createErrorAction = createAction(EV.ERROR);
//export const createCardTitleChangeAction = createAction<Payload<EV.CARD_TITLE_CHANGE>>(EV.CARD_TITLE_CHANGE);

export { 
    type Action,
    type PayloadAction,
    type PayloadEvent,
    type Payload,
    type NonPayloadAction,
    type NonPayloadEvent,
};
