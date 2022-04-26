import {performanceAlias} from "./aliases";

// strongly based on appendAvailablePerformanceMetrics() in piwik.js

function diff(end: number, start: number): number | undefined {
    const value = Math.round(end - start)
    if (value > 0) {
        return value
    }
    return
}

export class PerformanceMetric {
    pf_net?: number | undefined
    pf_srv?: number | undefined
    pf_tfr?: number | undefined
    pf_dm1?: number | undefined
    pf_dm2?: number | undefined
    pf_onl?: number | undefined

    constructor() {
        let performanceData: PerformanceNavigationTiming | PerformanceTiming | undefined
        performanceData = (typeof performanceAlias.timing === 'object') && performanceAlias.timing ? performanceAlias.timing : undefined;
        if (typeof performanceData === "undefined") {
            if ((typeof performanceAlias.getEntriesByType === 'function') && performanceAlias.getEntriesByType('navigation')) {
                performanceData = performanceAlias.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            }
        }

        if (!performanceData) {
            return;
        }
        if (performanceData.connectEnd && performanceData.fetchStart) {
            this.pf_net = diff(performanceData.connectEnd, performanceData.fetchStart)
        }
        if (performanceData.responseStart && performanceData.requestStart) {
            this.pf_srv = diff(performanceData.responseStart, performanceData.requestStart)
        }
        if (performanceData.responseStart && performanceData.responseEnd) {
            this.pf_tfr = diff(performanceData.responseStart, performanceData.responseEnd)
        }
        if (performanceData.responseStart && performanceData.responseEnd) {
            this.pf_tfr = diff(performanceData.responseStart, performanceData.responseEnd)
        }
        // @ts-ignore
        if (performanceData.domLoading !== "undefined") {
            // @ts-ignore
            if (performanceData.domInteractive && performanceData.domLoading) {
                // @ts-ignore
                this.pf_dm1 = diff(performanceData.domInteractive, performanceData.domLoading)
            }
        } else {
            if (performanceData.domInteractive && performanceData.responseEnd) {
                this.pf_dm1 = diff(performanceData.domInteractive, performanceData.responseEnd)
            }
        }
        if (performanceData.domComplete && performanceData.domInteractive) {
            this.pf_dm2 = diff(performanceData.domComplete, performanceData.domInteractive)
        }
        if (performanceData.loadEventEnd && performanceData.loadEventStart) {
            this.pf_onl = diff(performanceData.loadEventEnd, performanceData.loadEventStart)
        }
    }
}
