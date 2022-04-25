import {locationAlias} from "./aliases";
import type {IntBoolean} from "./types";


export function getCurrentURL(): string {
    // https://stackoverflow.com/a/5818284/4398037
    return locationAlias.protocol + '//' +
        locationAlias.hostname +
        (locationAlias.port ? ":" + locationAlias.port : "") +
        locationAlias.pathname +
        (locationAlias.search ? locationAlias.search : "")
}

export function boolToIntBool(value: boolean): IntBoolean {
    return value ? 1 : 0
}
