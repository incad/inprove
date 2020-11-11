package cz.inovatika.inprove.web.search;

import cz.inovatika.inprove.web.Options;
import static cz.inovatika.inprove.web.search.SourceSearcher.LOGGER;
import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.logging.Level;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.IOUtils;
import org.apache.solr.client.solrj.SolrQuery;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author alberto
 */
public class RDCZSearcher implements SourceSearcher {

  final String BASE = "rdczBase";

  public RDCZSearcher() {
  }

  public JSONObject digObjects(HttpServletRequest request) {
    try {
      String params = "rpredloha_digobjekt:" + URLEncoder.encode(request.getParameter("id"), "UTF-8");
      String url = Options.getInstance().getString(BASE);
      url += "digobjekt/select?q=" + params;
      String resp = IOUtils.toString(new URL(url), Charset.forName("UTF-8"));
      return new JSONObject(resp).getJSONObject("response");
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex);
    }
  }

  @Override
  public JSONObject relations(String[] carkody, String[] signatury) {
    try {

      if (carkody == null) {
        return new JSONObject().put("docs", new JSONArray());
      }
      for (int i = 0; i < carkody.length; i++) {
        carkody[i] = carkody[i].replace(" ", "+");
      }

      String params = "q=carkod:(" + String.join("+OR+", carkody) + ")";

      String url = Options.getInstance().getString(BASE);
//      url += "rdcz/select?" + URLEncoder.encode(params, StandardCharsets.UTF_8);
      url += "rdcz/select?" + params;

      String resp = IOUtils.toString(new URL(url), Charset.forName("UTF-8"));
      return new JSONObject(resp).getJSONObject("response");
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex).put("docs", new JSONArray());
    }
  }

  private void addRelations(JSONObject results) {
    JSONArray docs = results.getJSONObject("response").getJSONArray("docs");
    for (int i = 0; i < docs.length(); i++) {
      JSONObject doc = docs.getJSONObject(i);
      String[] carkody = null;
      if (!doc.optString("carkod").equals("")) {
        carkody = new String[]{doc.getString("carkod")};
      }
      String[] signatury = null;
      if (!doc.optString("signatura").equals("")) {
        signatury = new String[]{doc.getString("signatura")};
      }
      String[] sources = new String[]{"vdk", "czbrd", "dpz"};
      for (String source : sources) {
        SourceSearcher searcher = SearchUtils.getSearcher(source);
        doc.put(source, searcher.relations(carkody, signatury).getJSONArray("docs"));
      }
    }
  }

  @Override
  public JSONObject search(HttpServletRequest request) {
    try {
      String url = Options.getInstance().getString(BASE) + "rdcz/select?" + request.getQueryString();
      if (!url.contains("&q=")) {
        url += "&q=*";
      }

      int rows = Options.getInstance().getClientConf().getInt("defaultRows");
      if (request.getParameter("rows") != null) {
        rows = Integer.parseInt(request.getParameter("rows"));
      }
      url += "&rows=" + rows;
      if (request.getParameter("page") != null) {
        int start = (Integer.parseInt(request.getParameter("page"))) * rows;
        url += "&start=" + start;
      }
      url += "&facet=true&facet.mincount=1&facet.field=financovano&facet.field=vlastnik&facet.field=digknihovna&facet.field=druhdokumentu&facet.field=stav";
      url += "&qf=title_full%5E10.0%20_text_nolemmas%5E2.0%20title_nolemmas%5E3.0%20varnazev%5E1.1%20title_prefix%5E4.0%20title%5E1.5%20autor_first%5E4.2%20autor%5E1.2%20_text_&mm=100%25";

      url += "&facet=true&facet.range=rokvyd&facet.range.start=1300&facet.range.end=2022&facet.range.gap=10";
      String resp = IOUtils.toString(new URL(url), Charset.forName("UTF-8"));
      //return new JSONObject(resp);
      JSONObject results = new JSONObject(resp);
      addRelations(results);
      return results;
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex);
    }
  }

  @Override
  public long numFound(HttpServletRequest request) {
    try {
      String url = Options.getInstance().getString(BASE) + "rdcz/select?" + request.getQueryString();
      if (!url.contains("&q=")) {
        url += "&q=*";
      }
      url += "&qf=title_full%5E10.0%20_text_nolemmas%5E2.0%20title_nolemmas%5E3.0%20varnazev%5E1.1%20title_prefix%5E4.0%20title%5E1.5%20autor_first%5E4.2%20autor%5E1.2%20_text_&mm=100%25";

      JSONObject json = new JSONObject(IOUtils.toString(new URL(url), Charset.forName("UTF-8")));
      return json.getJSONObject("response").getInt("numFound");
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return 0;
    }
  }

  public void setQuery(HttpServletRequest request, SolrQuery query) {
    if (request.getParameter("q") != null) {
      query.setQuery(request.getParameter("q"));
    } else {
      query.setQuery("*:*");
    }

    int rows = Options.getInstance().getClientConf().getInt("defaultRows");
    if (request.getParameter("rows") != null) {
      rows = Integer.parseInt(request.getParameter("rows"));
      query.setRows(rows);
    }
    if (request.getParameter("page") != null) {
      int start = (Integer.parseInt(request.getParameter("page"))) * rows;
      query.setStart(start);
    }

    query.setFacet(true);
  }

}
