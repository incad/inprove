/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.inovatika.inprove.web;

import cz.inovatika.inprove.web.search.CZBRDSearcher;
import cz.inovatika.inprove.web.search.DPZSearcher;
import cz.inovatika.inprove.web.search.RDCZSearcher;
import cz.inovatika.inprove.web.search.SearchUtils;
import cz.inovatika.inprove.web.search.SourceSearcher;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author alberto
 */
@WebServlet(name = "SearchServlet", urlPatterns = {"/search/*"})
public class SearchServlet extends HttpServlet {

  public static final Logger LOGGER = Logger.getLogger(SearchServlet.class.getName());

  /**
   * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
   * methods.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    response.setContentType("application/json;charset=UTF-8");
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0
    response.setDateHeader("Expires", 0); // Proxies.
    PrintWriter out = response.getWriter();
    try {
      String action = request.getPathInfo().substring(1);
      if (action != null) {
        Actions actionToDo = Actions.valueOf(action.toUpperCase());
        String json = actionToDo.doPerform(request, response);
        out.println(json);
      } else {
        out.print("action -> " + action);
      }
    } catch (IOException e1) {
      LOGGER.log(Level.SEVERE, e1.getMessage(), e1);
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e1.toString());
      out.print(e1.toString());
    } catch (SecurityException e1) {
      LOGGER.log(Level.SEVERE, e1.getMessage(), e1);
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    } catch (Exception e1) {
      LOGGER.log(Level.SEVERE, e1.getMessage(), e1);
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e1.toString());
      out.print(e1.toString());
    }
  }

  enum Actions {

    HOME {
      @Override
      String doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {

        JSONObject json = new JSONObject();
        try (HttpSolrClient client = new HttpSolrClient.Builder(Options.getInstance().getString("solrhost")).build()) {
          SolrQuery query = new SolrQuery("*")
                  .setRows(0);

        } catch (Exception ex) {
          json.put("error", ex);
        }
        return json.toString();
      }
    },
    TOTALS {
      @Override
      String doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {

        JSONObject json = new JSONObject();
        try {
          List<Object> sources = Options.getInstance().getClientConf().getJSONArray("sources").toList();
          for (Object sourceMap : sources) {
            Map map = (Map) sourceMap;
            if ((Boolean) map.get("searchable")) {
              String source = (String) map.get("label");
              SourceSearcher searcher = SearchUtils.getSearcher(source);
              json.put(source, searcher.numFound(request));
            }
          }
        } catch (Exception ex) {
          LOGGER.log(Level.SEVERE, null, ex);
          json.put("error", ex);
        }
        return json.toString();
      }
    },
    QUERY {
      @Override
      String doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {

        String source = "" + request.getParameter("source");
        SourceSearcher searcher = SearchUtils.getSearcher(source);
        return searcher.search(request).toString();
      }
    },
    RELATIONS {
      @Override
      String doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {

        JSONObject json = new JSONObject();
        try {
//          List<Object> sources = Options.getInstance().getClientConf().getJSONArray("sources").toList();
//          for (Object sourceMap : sources) {
//            Map map = (Map) sourceMap;

          for (String source : request.getParameterValues("insource")) {
            SourceSearcher searcher = SearchUtils.getSearcher(source);
            json.put(source, searcher.relations(request.getParameterValues("carkod"), request.getParameterValues("signatura")));
          }
        } catch (Exception ex) {
          LOGGER.log(Level.SEVERE, null, ex);
          json.put("error", ex);
        }
        return json.toString();
      }
    },
    RDCZ {
      @Override
      String doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {
        RDCZSearcher searcher = new RDCZSearcher();
        return searcher.relations(request.getParameterValues("carkod"), request.getParameterValues("signatura")).toString(); 
      }
    },
    RDCZ_DIGOBJECTS {
      @Override
      String doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {
        RDCZSearcher searcher = new RDCZSearcher();
        return searcher.digObjects(request).toString(); 
      }
    },
    CZBRD {
      @Override
      String doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {
        CZBRDSearcher searcher = new CZBRDSearcher();
        return searcher.relations(request.getParameterValues("carkod"), request.getParameterValues("signatura")).toString(); 
      }
    },
    DPZ {
      @Override
      String doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {
        DPZSearcher searcher = new DPZSearcher();
        return searcher.relations(request.getParameterValues("carkod"), request.getParameterValues("signatura")).toString(); 
      }
    };

    abstract String doPerform(HttpServletRequest req, HttpServletResponse resp) throws Exception;
  }

  // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
  /**
   * Handles the HTTP <code>GET</code> method.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    processRequest(request, response);
  }

  /**
   * Handles the HTTP <code>POST</code> method.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    processRequest(request, response);
  }

  /**
   * Returns a short description of the servlet.
   *
   * @return a String containing servlet description
   */
  @Override
  public String getServletInfo() {
    return "Short description";
  }// </editor-fold>

}
