import { type Action as SourceAction } from "../Action";

declare global {

    type Action = SourceAction;

}
