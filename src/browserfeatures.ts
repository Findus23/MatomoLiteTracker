import {navigatorAlias, screenAlias} from "./aliases";

export interface BrowserPlugins {
    pdf?: boolean
    qt?: boolean
    realp?: boolean
    wma?: boolean
    fla?: boolean
    java?: boolean
    ag?: boolean
    [id: string]: any
}

const pluginMap = {
    pdf: 'application/pdf',
    qt: 'video/quicktime',
    realp: 'audio/x-pn-realaudio-plugin',
    wma: 'application/x-mplayer2',
    fla: 'application/x-shockwave-flash',
    java: 'application/x-java-vm',
    ag: 'application/x-silverlight'

};


export function detectBrowserPlugins(): BrowserPlugins {
    const mimeTypes = navigatorAlias.mimeTypes
    const plugins: BrowserPlugins = {}
    if (mimeTypes && mimeTypes.length) {
        Object.entries(pluginMap).forEach(([key, mimeType]) => {
            const mime = mimeTypes.namedItem(mimeType)
            plugins[key] = (mime && mime.enabledPlugin)
        })
    }
    return plugins
}

export class BrowserFeatures {
    plugins?: BrowserPlugins
    cookie: boolean;
    res: string

    constructor() {
        this.cookie = navigatorAlias.cookieEnabled
        const width = screenAlias.width
        const height = screenAlias.height
        this.res = width + "x" + height
    }

    addBrowserPlugins(plugins: BrowserPlugins) {
        this.plugins = plugins
    }


}
