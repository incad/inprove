
package cz.inovatika.inprove.web.search;

import cz.inovatika.inprove.web.Options;
import static cz.inovatika.inprove.web.search.SourceSearcher.LOGGER;
import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author alberto
 */
public class CZBRDSearcher implements SourceSearcher {
  
  final String BASE = "czbrdBase";

  public CZBRDSearcher() {
  }
  
  @Override
  public JSONObject relations(String[] carkody, String[] signatury) {
    try {
      String params = null;
      if (carkody != null) {
        for (int i = 0; i < carkody.length; i++) {
           carkody[i] = "\"" + URLEncoder.encode(carkody[i], "UTF-8") + "\"";
        }
        params = "q=ex_BIBCARKOD:(" + String.join("%20OR%20", carkody) + ")";
      } else {
        if (signatury != null) {
          for (int i = 0; i < signatury.length; i++) {
             signatury[i] = "\"" + URLEncoder.encode(signatury[i], "UTF-8") + "\"";
          }
          params = "q=ex_BIBSIGNATURA:(" + String.join("%20OR%20", signatury) + ")";
        }
      }
      
      if(params == null) {
        return new JSONObject().put("docs", new JSONArray());
      }
      String url = Options.getInstance().getString(BASE) + params;
      String resp = IOUtils.toString(new URL(url), Charset.forName("UTF-8"));
      return new JSONObject(resp).getJSONObject("response");
    } catch (Exception ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex).put("docs", new JSONArray()); 
    }
  }

  @Override
  public JSONObject search(HttpServletRequest request) {
    try {
      String url = Options.getInstance().getString(BASE) + request.getQueryString();
      if (request.getParameter("sort") != null) {
        url += "&order=" + request.getParameter("sort");
      }
      url += "&facet.mincount=1";
      int rows = Options.getInstance().getClientConf().getInt("defaultRows");
      if (request.getParameter("rows") != null) {
        rows = Integer.parseInt(request.getParameter("rows"));
      }
      if (request.getParameter("page") != null) {
        int start = (Integer.parseInt(request.getParameter("page"))) * rows;
        url += "&offset=" + start;
      }
       String resp = IOUtils.toString(new URL(url), Charset.forName("UTF-8"));
      JSONObject results = new JSONObject(resp);
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
      if (doc.optString("ex_BIBCARKOD") != null) {
        carkody = new String[]{doc.getString("ex_BIBCARKOD")};
      }
      String[] signatury = null;
      if (doc.optString("ex_BIBSIGNATURA") != null) {
        signatury = new String[]{doc.getString("ex_BIBSIGNATURA")};
      }
      String[] sources = new String[]{"vdk", "rdcz", "dpz"};
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
      JSONObject json = new JSONObject(IOUtils.toString(new URL(url), Charset.forName("UTF-8")));
      return json.getJSONObject("response").getInt("numFound");
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return 0; 
    }
  }
  
  
}
