import type {MatomoLiteTracker} from "./tracker"
import {documentAlias, locationAlias} from "./aliases"
import type {LinkType} from "./types";

// strongly based on clickHandler of matomo.js

//all names based on right-handed mouse
enum MouseButton {
    Left = 0,
    Wheel = 1,
    Right = 2
}

const scriptProtocol = new RegExp('^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto|tel):', 'i');

export const defaultDownloadFileExtensions = ['7z', 'aac', 'apk', 'arc', 'arj', 'asf', 'asx', 'avi', 'azw3', 'bin', 'csv', 'deb', 'dmg', 'doc', 'docx', 'epub', 'exe', 'flv', 'gif', 'gz', 'gzip', 'hqx', 'ibooks', 'jar', 'jpg', 'jpeg', 'js', 'mobi', 'mp2', 'mp3', 'mp4', 'mpg', 'mpeg', 'mov', 'movie', 'msi', 'msp', 'odb', 'odf', 'odg', 'ods', 'odt', 'ogg', 'ogv', 'pdf', 'phps', 'png', 'ppt', 'pptx', 'qt', 'qtm', 'ra', 'ram', 'rar', 'rpm', 'rtf', 'sea', 'sit', 'tar', 'tbz', 'tbz2', 'bz', 'bz2', 'tgz', 'torrent', 'txt', 'wav', 'wma', 'wmv', 'wpd', 'xls', 'xlsx', 'xml', 'z', 'zip']

export function enableLinkTracking(
    matomo: MatomoLiteTracker,
    downloadFileExtensions?: string[],
    alsoTrackMouseclicks: boolean = false,
    ignoredClasses = ["matomo_ignore", "piwik_ignore"],
) {

    function getLinkType(element: HTMLAnchorElement, href: string): LinkType {
        if (element.classList.contains("matomo_link")) {
            return "link"
        }
        if (
            element.classList.contains("matomo_download")
            || element.hasAttribute("download")
        ) {
            return "download"
        }
        if (downloadFileExtensions) {
            const downloadExtensionsPattern = new RegExp('\\.(' + downloadFileExtensions.join('|') + ')([?&#]|$)', 'i');
            if (downloadExtensionsPattern.test(href)) {
                return "download"
            }
        }
        return "link"

    }

    function processClick(element: HTMLAnchorElement) {
        console.log(element)
        if (!element.hasAttribute("href")) {
            return
        }

        const href = element.href
        if (scriptProtocol.test(href)) {
            return;
        }
        const linkType = getLinkType(element, href)

        if (element.host === locationAlias.host) {
            // only track external hosts
            return;
        }

        matomo.trackLink(href, linkType)
    }


    function getLinkTarget(event: MouseEvent): HTMLAnchorElement | undefined {
        let target = event.target
        if (!(target instanceof Element)) {
            return
        }
        let nodeName = target.nodeName
        for (const ignoredClass of ignoredClasses) {
            if (target.classList.contains(ignoredClass)) {
                return
            }
        }

        while (nodeName != "A" && target && target.parentNode) {
            target = target.parentNode
            if (!(target instanceof Element)) {
                return
            }
            nodeName = target.nodeName
        }

        if (target && nodeName == "A") {
            return target as HTMLAnchorElement
        }
        return
    }


    function clickHandler(event: MouseEvent) {
        const target = getLinkTarget(event)
        if (!target) {
            return
        }

        const mouseButton: MouseButton = event.button
        let lastButton: MouseButton|undefined
        let lastTarget: Element|undefined
        switch (event.type) {
            case "click" :
                const ignoreClick = alsoTrackMouseclicks && mouseButton === MouseButton.Wheel
                if (!ignoreClick) {
                    processClick(target)
                }
                break
            case "mousedown":
                if (mouseButton === MouseButton.Wheel) {
                    lastButton = mouseButton
                    lastTarget = target
                } else {
                    lastButton = lastTarget = undefined
                }
                break
            case "mouseup":
                if (mouseButton === lastButton && target === lastTarget) {
                    processClick(target)
                }
                lastButton = lastTarget = undefined
                break
            case "contextmenu":
                processClick(target)
                break
        }

    }

    const body = documentAlias.body
    body.addEventListener("click", clickHandler, true)
    if (alsoTrackMouseclicks) {
        body.addEventListener("mouseup", clickHandler, true)
        body.addEventListener("mousedown", clickHandler, true)
        body.addEventListener("contextmenu", clickHandler, true)
    }
}
