/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.inovatika.inprove.web.search;

import cz.inovatika.inprove.web.Options;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.impl.NoOpResponseParser;
import org.apache.solr.client.solrj.request.QueryRequest;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.util.NamedList;
import org.json.JSONObject;
 
/**
 *
 * @author alberto
 */
public class SearchUtils {

  static final Logger LOGGER = Logger.getLogger(SearchUtils.class.getName());

  static Map<String, String> obdobi_poradi;

  public static String getObdobiPoradi(String obdobi) {
    if (obdobi_poradi == null) {
      initObdobiPoradi();
    }
    return obdobi_poradi.get(obdobi.toLowerCase());
  }

  private static void initObdobiPoradi() {
    try (HttpSolrClient client = new HttpSolrClient.Builder(Options.getInstance().getString("solrhost")).build()) {
      obdobi_poradi = new HashMap<>();

      SolrQuery query = new SolrQuery()
              .setQuery("heslar_name:obdobi_druha")
              .setRows(1000)
              .setFields("poradi,nazev,zkratka");
      QueryResponse resp = client.query("heslar", query);
      for (SolrDocument doc : resp.getResults()) {
        obdobi_poradi.put(((String) doc.getFieldValue("zkratka")).toLowerCase(), "" + doc.getFieldValue("poradi"));
        obdobi_poradi.put(((String) doc.getFieldValue("nazev")).toLowerCase(), "" + doc.getFieldValue("poradi"));
      }
      // LOGGER.log(Level.INFO, "obdobi: {0}", obdobi_poradi.size());
    } catch (SolrServerException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
    }
  }

  public static JSONObject json(SolrQuery query, String coreUrl) {
    query.set("wt", "json");
    String jsonResponse;
    try (HttpSolrClient client = new HttpSolrClient.Builder(coreUrl).build()) {
      QueryRequest qreq = new QueryRequest(query);
      NoOpResponseParser dontMessWithSolr = new NoOpResponseParser();
      dontMessWithSolr.setWriterType("json");
      client.setParser(dontMessWithSolr);
      NamedList<Object> qresp = client.request(qreq);
      jsonResponse = (String) qresp.get("response");
      client.close();
      return new JSONObject(jsonResponse);
    } catch (SolrServerException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex);
    }
  }

  public static JSONObject json(SolrQuery query, HttpSolrClient client, String core) {
    query.set("wt", "json");
    String jsonResponse;
    try {
      QueryRequest qreq = new QueryRequest(query);
      NoOpResponseParser dontMessWithSolr = new NoOpResponseParser();
      dontMessWithSolr.setWriterType("json");
      client.setParser(dontMessWithSolr);
      NamedList<Object> qresp = client.request(qreq, core);
      jsonResponse = (String) qresp.get("response");
      return new JSONObject(jsonResponse);
    } catch (SolrServerException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return new JSONObject().put("error", ex);
    }
  }

  public static JSONObject clean(Instant date, String core) {
    JSONObject ret = new JSONObject();
    try (SolrClient solr = new HttpSolrClient.Builder(core).build()) {
      solr.deleteByQuery("indextime:[* TO " + date.toString() + "]", 1);
      ret.put("resp", "success");
    } catch (SolrServerException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      ret.put("error", ex.toString());
    }
    return ret;
  }

  public static SourceSearcher getSearcher(String source) {
    SourceSearcher searcher;
    switch (source) {
      case "rdcz":
        searcher = new RDCZSearcher();
        break;
      case "vdk":
        searcher = new VDKSearcher();
        break;
      case "czbrd":
        searcher = new CZBRDSearcher();
        break;
      case "dpz":
        searcher = new DPZSearcher();
        break;
      default:
        searcher = new VDKSearcher();
    }
    return searcher;
  }
}
