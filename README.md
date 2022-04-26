# Matomo Lite Tracker

This is an experiment of building a more lightweight variant of matomo.js by removing rarely used features and support
for old browsers.

**Keep in mind this is**:

- experimental: I can't guarantee that it will work as expected
- inofficial: This is not officially maintained by the Matomo team
- incomplete: See below.

That said, if you are interested in trying it out, I'd be interested in hearing your feedback.

## Advantages:

- much smaller (1KB gzipped with only the core code)
- easier to bundle in applications

## Features

- tracking page views
- custom dimensions
- send data via POST
- browser features
    - cookie
    - res
    - browser plugins (pdf, flash, etc.)
- User ID
- Event Tracking
- Campaign tracking
- Search Tracking
- Goal Tracking
- Outlink Tracking
- manual ping
- manual DoNotTrack detection
- sendBeacon
- Performance Tracking


## missing (yet)

- non utf-8 pages
- setCustomUrl
- setReferrerUrl
- HeartBeatTimer (automatic regular ping)

## missing (???)

- consent tracking, opt-in, opt-out (probably better to be implemented by the user)
- Content Tracking
- download tracking
- setDomains
- event queue (every tracking request is sent immediatly when it is tracked)[^1]

## missing (intentionally)

- Support for Internet Explorer and other outdated browsers
- everything using cookies (except possibly the opt-out cookie)
- custom variables
- Support for Matomo plugins
- E-Commerce tracking

[^1]: This might create some issues if you run `trackPageview()` and `trackEvent()` at the same time as the requests
might not reach Matomo in this order.
