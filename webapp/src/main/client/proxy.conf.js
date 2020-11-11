const PROXY_CONFIG = {
  "/api/**": {
    "target": "http://localhost:8983/solr/dokument/select",
    "logLevel": "debug",
    "bypass": function (req) {
      req.headers["X-Custom-Header"] = "yes";
      if (req.path.indexOf('/assets') > -1) {
        return req.url;
      }
      if (req.path.indexOf('/search') > -1 ) {
        if (req.path.indexOf('/totals') > -1) {
          return "/mock/totals.json";
        } else if (req.originalUrl.indexOf('source=vdk') > -1) {
          return "/mock/vdk.json";
        } else if (req.originalUrl.indexOf('source=rdcz') > -1) {
          return "/mock/rdcz.json";
        } else if (req.originalUrl.indexOf('source=dpz') > -1) {
          return "/mock/razitka.json";
        } else if (req.originalUrl.indexOf('source=czbrd') > -1) {
          return "/mock/czbrd.json";
        } else {
          return "/mock/empty.json";
        }
      } 
    },
    "pathRewrite": {
      //"^/api":"",
      "^(.*)": ""
    },
    "changeOrigin": false,
    "secure": false
  }
};
module.exports = PROXY_CONFIG;
