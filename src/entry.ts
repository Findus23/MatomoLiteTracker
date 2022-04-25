import {MatomoLiteTracker} from "./tracker";

window.MatomoLiteTracker = MatomoLiteTracker

declare global {
    interface Window {
        MatomoLiteTracker: typeof MatomoLiteTracker;
    }
}
