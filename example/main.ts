import {MatomoLiteTracker} from "../src/tracker";
import {BrowserFeatures, detectBrowserPlugins} from "../src/browserfeatures";
import {defaultDownloadFileExtensions, enableLinkTracking} from "../src/linktracking";
import {PerformanceMetric} from "../src/performancetracking";

const matomo = new MatomoLiteTracker("https://dev.matomo", 1)
matomo.performanceMetric = new PerformanceMetric()

const features = new BrowserFeatures()
features.addBrowserPlugins(detectBrowserPlugins())
matomo.browserFeatures = features
matomo.customDimensions = {
    2: "something"
}

enableLinkTracking(matomo, defaultDownloadFileExtensions)
matomo.trackPageviewOnPageload()
