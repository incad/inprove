package cz.inovatika.inprove.web.search;

import cz.inovatika.inprove.web.Options;
import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.logging.Level;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author alberto
 */
public class DPZSearcher implements SourceSearcher {

  final String BASE = "dpzBase";

  public DPZSearcher() {
  }

  @Override
  public JSONObject relations(String[] carkody, String[] signatury) {
    try {
      String url = Options.getInstance().getString(BASE);
//      for (int i = 0; i < values.length; i++) {
//        values[i] = "%22" + values[i].replace(" ", "+") + "%22";
//      }
      if (signatury == null) {
        return new JSONObject().put("docs", new JSONArray());
      }
      String joined = String.join(" OR ", signatury);
      url += "q=signatura:(" + URLEncoder.encode(joined, "UTF-8") + ")";

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
      if (!url.contains("&q=")) {
        url += "&q=*";
      }
      url += "&df=_text_";
      int rows = Options.getInstance().getClientConf().getInt("defaultRows");
      if (request.getParameter("rows") != null) {
        rows = Integer.parseInt(request.getParameter("rows"));
      }
      url += "&rows=" + rows;
      if (request.getParameter("page") != null) {
        int start = (Integer.parseInt(request.getParameter("page"))) * rows;
        url += "&start=" + start;
      }
      return new JSONObject(IOUtils.toString(new URL(url), Charset.forName("UTF-8")));
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex);
    }
  }

  @Override
  public long numFound(HttpServletRequest request) {
    try {
      String url = Options.getInstance().getString(BASE) + request.getQueryString();
      if (!url.contains("&q=")) {
        url += "&q=*";
      }
      url += "&df=_text_";
      JSONObject json = new JSONObject(IOUtils.toString(new URL(url), Charset.forName("UTF-8")));
      return json.getJSONObject("response").getInt("numFound");
    } catch (Exception ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return 0;
    }
  }

}
