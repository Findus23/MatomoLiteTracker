import {navigatorAlias} from "./aliases";

export function generateUniqueId(length: number = 6): string {
    let id = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charLen = chars.length;

    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * charLen));
    }

    return id;
}

export function isDoNotTrackEnabled(): boolean {
    const dnt = navigatorAlias.doNotTrack
    return dnt === "yes" || dnt === "1"
}
