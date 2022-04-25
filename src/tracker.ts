import {documentAlias, navigatorAlias} from "./aliases";
import {boolToIntBool, getCurrentURL} from "./url";
import type {CustomDimensionName, CustomDimensions, IntBoolean, LinkType} from "./types";
import type {BrowserFeatures} from "./browserfeatures";
import {generateUniqueId} from "./util";
import type {PerformanceMetric} from "./performancetracking";


// the query paramters the Matomo API expects to recieve
interface Request {
    idsite: number
    // always 1
    rec: 1
    // random string
    r: string
    // local hour
    h: number,
    // local minute
    m: number,
    // local second
    s: number,
    // current URL
    url: string
    // referrer URL
    urlref?: string
    // userID
    uid?: string
    // random ID
    _id?: any
    // new visitor
    _nid?: any // (maybe always send "1"?)

    // campaign tracking (ignored for now)
    _rcn?: string
    _rck?: string
    _refts?: number
    _ref?: string

    // character set (not needed if utf-8)
    cs?: string

    send_image: IntBoolean

    pdf?: IntBoolean
    qt?: IntBoolean
    realp?: IntBoolean
    wma?: IntBoolean
    fla?: IntBoolean
    java?: IntBoolean
    ag?: IntBoolean

    cookie?: IntBoolean
    res?: string


    // custom dimensions
    [id: CustomDimensionName]: string

    // Page View ID
    pv_id?: string

    // fallback for everything else
    [id: string]: any

}

interface PageViewRequest extends Request {
    // Title
    action_name: string
    pf_net?: number
    pf_srv?: number
    pf_tfr?: number
    pf_dm1?: number
    pf_dm2?: number
    pf_onl?: number

}

interface EventRequest extends Request {
    // Event Category
    e_c: string
    // Event Action
    e_a: string
    // Event Name
    e_n?: string
    // Event Value
    e_v?: number
}

interface SearchRequest extends Request {
    // Search Keyword
    search: string
    // Search Category
    search_cat?: string
    // Search Count
    search_count?: number
}

interface GoalRequest extends Request {
    idgoal: number | string
    revenue?: number | string
}

interface OutlinkRequest extends Request {
    link?: string
    download?: string
}

interface PingRequest extends Request {
    ping: 1
}

export class MatomoLiteTracker {
    siteID: number
    matomoURL: string
    phpFileName: string = "matomo.php"
    useSendBeacon: boolean = false
    performanceMetric?: PerformanceMetric
    userID?: string
    browserFeatures?: BrowserFeatures
    customDimensions?: CustomDimensions
    requestMethod: "GET" | "POST" = "GET"
    private pageViewID?: string;

    constructor(matomoURL: string, siteID: number,) {
        this.matomoURL = matomoURL;
        this.siteID = siteID;
    }

    getRequest(): Request {
        const now = new Date()
        const parameters: Request = {
            idsite: this.siteID,
            rec: 1,
            r: String(Math.random()).slice(2, 8),
            h: now.getHours(),
            m: now.getMinutes(),
            s: now.getSeconds(),
            url: getCurrentURL(),
            send_image: 1
        }
        const referrer = documentAlias.referrer
        if (referrer) {
            parameters.urlref = referrer
        }
        if (this.pageViewID) {
            parameters.pv_id = this.pageViewID
        }
        if (this.userID) {
            parameters.uid = this.userID
        }
        if (this.browserFeatures) {
            const features = this.browserFeatures
            parameters.res = features.res
            parameters.cookie = boolToIntBool(features.cookie)
            if (features.plugins) {

                Object.entries(features.plugins).forEach(([key, supported]) => {
                    parameters[key] = boolToIntBool(supported)
                })
            }
        }
        const cd = this.customDimensions
        if (cd) {
            for (let customDimensionsKey in cd) {
                parameters[`dimension${customDimensionsKey}`] = cd[customDimensionsKey]
            }
        }
        return parameters
    }

    trackPageview(customTitle?: string) {
        this.pageViewID = generateUniqueId()
        const parameters = this.getRequest() as PageViewRequest
        parameters.action_name = customTitle ? customTitle : documentAlias.title
        const performanceMetric = this.performanceMetric
        if (performanceMetric) {
            console.log(performanceMetric)
            Object.entries(performanceMetric).forEach(([key, value]) => {
                if (typeof value !== "undefined") {
                    parameters[key] = value
                }
            })

        }
        this.sendRequest(parameters)
    }

    trackEvent(category: string, action: string, name?: string, value?: number) {
        const parameters = this.getRequest() as EventRequest
        parameters.e_c = category
        parameters.e_a = action
        if (name) {
            parameters.e_n = name
        }
        if (value) {
            parameters.e_v = value
        }
        this.sendRequest(parameters)
    }

    trackSiteSearch(keyword: string, category?: string, resultsCount?: number) {
        const parameters = this.getRequest() as SearchRequest
        parameters.search = keyword
        if (category) {
            parameters.search_cat = category
        }
        if (resultsCount) {
            parameters.search_count = resultsCount
        }
        this.sendRequest(parameters)
    }

    trackGoal(idGoal: number | string, customRevenue?: number | string) {
        const parameters = this.getRequest() as GoalRequest
        parameters.idgoal = idGoal
        if (customRevenue) {
            parameters.revenue = customRevenue
        }
        this.sendRequest(parameters)
    }

    trackLink(sourceUrl: string, linkType: LinkType) {
        const parameters = this.getRequest() as OutlinkRequest
        parameters[linkType] = sourceUrl
        this.sendRequest(parameters, true)
    }

    ping() {
        const parameters = this.getRequest() as PingRequest
        parameters.ping = 1
        this.sendRequest(parameters)
    }

    sendRequest(parameters: Request, forceBeacon: boolean = false) {
        console.log(parameters)
        const requestMethod = this.requestMethod
        const params = new URLSearchParams(parameters)
        let url = this.matomoURL
            + (this.matomoURL.endsWith("/") ? "" : "/")
            + this.phpFileName
        console.log(url)
        if (this.useSendBeacon || forceBeacon) {
            navigatorAlias.sendBeacon(url, params)
        } else {
            if (requestMethod === "GET") {
                url += "?" + params.toString()
            }
            const options: RequestInit = {
                method: requestMethod,
                mode: "no-cors",
                cache: "no-cache",
                credentials: "omit",
            }
            if (requestMethod === "POST") {
                options.body = params
            }
            fetch(url, options).then(value => {
                console.info(value)
            })
        }
    }
}
