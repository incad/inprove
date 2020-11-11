package cz.inovatika.inprove.web.search;

import cz.inovatika.inprove.web.Options;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.IOUtils;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author alberto
 */
public class VDKSearcher implements SourceSearcher {

  final String BASE2 = "http://vdk.nkp.cz/vdk/search?action=BYQUERY&";
  final String BASE1 = "http://localhost:8080/vdk/api/search/query?";
  final String BASE = "vdkBase";

  public VDKSearcher() {
  }

  @Override
  public JSONObject relations(String[] carkody, String[] signatury) {
    try {
      String params = null;

      if (carkody != null) {
        for (int i = 0; i < carkody.length; i++) {
          carkody[i] = carkody[i].replace(" ", "+");
        }
        params = "q=carkod:" + String.join("+OR+", carkody) + "";
      } else {
        if (signatury != null) {
          for (int i = 0; i < signatury.length; i++) {
            signatury[i] = URLEncoder.encode("\"" + signatury[i] + "\"", "UTF-8");
          }
          params = "q=signatura:(" + String.join("+OR+", signatury) + ")";
        }
      }

      if (params == null) {
        return new JSONObject().put("docs", new JSONArray());
      }

//      for (int i = 0; i < values.length; i++) {
//        values[i] = values[i].replace(" ", "+");
//      }
      String url = Options.getInstance().getString(BASE) + params;
      String resp = IOUtils.toString(new URL(url), Charset.forName("UTF-8"));
      return new JSONObject(resp).getJSONObject("response");
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex).put("docs", new JSONArray());
    }
  }

  @Override
  public JSONObject search(HttpServletRequest request) {
    try {
      String url = Options.getInstance().getString(BASE) + request.getQueryString();
//      if (!url.contains("&q=")) {
//        url += "&q=*:*";
//      }
      int rows = Options.getInstance().getClientConf().getInt("defaultRows");
      if (request.getParameter("rows") != null) {
        rows = Integer.parseInt(request.getParameter("rows"));
      }
      url += "&rows=" + rows;
      if (request.getParameter("page") != null) {
        int start = (Integer.parseInt(request.getParameter("page"))) * rows;
        url += "&offset=" + start;
      }

      url += "&facet=true&facet.range=rokvydani&facet.range.start=1300&facet.range.end=2022&facet.range.gap=10";
      url += "&defType=edismax&qf=title%5E10.0%20author%5E1.2%20text&mm=100%25";

      JSONObject results = new JSONObject(IOUtils.toString(new URL(url), Charset.forName("UTF-8")));
      addRelations(results);
      return results;
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex);
    }
  }

  private void addRelations(JSONObject results) {
    JSONArray docs = results.getJSONObject("response").getJSONArray("docs");
    for (int i = 0; i < docs.length(); i++) {
      JSONObject doc = docs.getJSONObject(i);
      String[] carkody = null;
      if (doc.optJSONArray("carkod") != null) {
        carkody = doc.getJSONArray("carkod").toList().toArray(new String[0]);
      }
      String[] signatury = null;
      if (doc.optJSONArray("signatura") != null) {
        signatury = doc.getJSONArray("signatura").toList().toArray(new String[0]);
      }
      String[] sources = new String[]{"rdcz", "czbrd", "dpz"};
      for (String source : sources) {
        SourceSearcher searcher = SearchUtils.getSearcher(source);
        doc.put(source, searcher.relations(carkody, signatury).getJSONArray("docs"));
      }
    }
  }

  @Override
  public long numFound(HttpServletRequest request) {
    try {
      String url = Options.getInstance().getString(BASE) + request.getQueryString();
      if (!url.contains("&q=")) {
        url += "&q=*";
      }
      JSONObject json = new JSONObject(IOUtils.toString(new URL(url), Charset.forName("UTF-8")));
      return json.getJSONObject("response").getInt("numFound");
    } catch (Exception ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return 0;
    }
  }

}
