npmjs.com/package/http-status-codes



# http-status-codes - npm


---
```ts
import {
ReasonPhrases,
StatusCodes,
getReasonPhrase,
getStatusCode,
} from 'http-status-codes';

response
.status(StatusCodes.OK)
.send(ReasonPhrases.OK);

response
.status(StatusCodes.INTERNAL_SERVER_ERROR)
.send({
error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
});

response
.status(getStatusCode('Internal Server Error'))
.send({
error: 'Internal Server Error'
});
```

## [](https://www.npmjs.com/package/http-status-codes#codes)Codes

| Code | Constant | Reason Phrase |
| --- | --- | --- |
| 100 | CONTINUE | Continue |
| 101 | SWITCHING\_PROTOCOLS | Switching Protocols |
| 102 | PROCESSING | Processing |
| 200 | OK | OK |
| 201 | CREATED | Created |
| 202 | ACCEPTED | Accepted |
| 203 | NON\_AUTHORITATIVE\_INFORMATION | Non Authoritative Information |
| 204 | NO\_CONTENT | No Content |
| 205 | RESET\_CONTENT | Reset Content |
| 206 | PARTIAL\_CONTENT | Partial Content |
| 207 | MULTI\_STATUS | Multi-Status |
| 300 | MULTIPLE\_CHOICES | Multiple Choices |
| 301 | MOVED\_PERMANENTLY | Moved Permanently |
| 302 | MOVED\_TEMPORARILY | Moved Temporarily |
| 303 | SEE\_OTHER | See Other |
| 304 | NOT\_MODIFIED | Not Modified |
| 305 | USE\_PROXY | Use Proxy |
| 307 | TEMPORARY\_REDIRECT | Temporary Redirect |
| 308 | PERMANENT\_REDIRECT | Permanent Redirect |
| 400 | BAD\_REQUEST | Bad Request |
| 401 | UNAUTHORIZED | Unauthorized |
| 402 | PAYMENT\_REQUIRED | Payment Required |
| 403 | FORBIDDEN | Forbidden |
| 404 | NOT\_FOUND | Not Found |
| 405 | METHOD\_NOT\_ALLOWED | Method Not Allowed |
| 406 | NOT\_ACCEPTABLE | Not Acceptable |
| 407 | PROXY\_AUTHENTICATION\_REQUIRED | Proxy Authentication Required |
| 408 | REQUEST\_TIMEOUT | Request Timeout |
| 409 | CONFLICT | Conflict |
| 410 | GONE | Gone |
| 411 | LENGTH\_REQUIRED | Length Required |
| 412 | PRECONDITION\_FAILED | Precondition Failed |
| 413 | REQUEST\_TOO\_LONG | Request Entity Too Large |
| 414 | REQUEST\_URI\_TOO\_LONG | Request-URI Too Long |
| 415 | UNSUPPORTED\_MEDIA\_TYPE | Unsupported Media Type |
| 416 | REQUESTED\_RANGE\_NOT\_SATISFIABLE | Requested Range Not Satisfiable |
| 417 | EXPECTATION\_FAILED | Expectation Failed |
| 418 | IM\_A\_TEAPOT | I'm a teapot |
| 419 | INSUFFICIENT\_SPACE\_ON\_RESOURCE | Insufficient Space on Resource |
| 420 | METHOD\_FAILURE | Method Failure |
| 421 | MISDIRECTED\_REQUEST | Misdirected Request |
| 422 | UNPROCESSABLE\_ENTITY | Unprocessable Entity |
| 423 | LOCKED | Locked |
| 424 | FAILED\_DEPENDENCY | Failed Dependency |
| 428 | PRECONDITION\_REQUIRED | Precondition Required |
| 429 | TOO\_MANY\_REQUESTS | Too Many Requests |
| 431 | REQUEST\_HEADER\_FIELDS\_TOO\_LARGE | Request Header Fields Too Large |
| 451 | UNAVAILABLE\_FOR\_LEGAL\_REASONS | Unavailable For Legal Reasons |
| 500 | INTERNAL\_SERVER\_ERROR | Internal Server Error |
| 501 | NOT\_IMPLEMENTED | Not Implemented |
| 502 | BAD\_GATEWAY | Bad Gateway |
| 503 | SERVICE\_UNAVAILABLE | Service Unavailable |
| 504 | GATEWAY\_TIMEOUT | Gateway Timeout |
| 505 | HTTP\_VERSION\_NOT\_SUPPORTED | HTTP Version Not Supported |
| 507 | INSUFFICIENT\_STORAGE | Insufficient Storage |
| 511 | NETWORK\_AUTHENTICATION\_REQUIRED | Network Authentication Required |
