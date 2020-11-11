/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.inovatika.inprove.web.search;

import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import org.json.JSONObject;

/**
 *
 * @author alberto
 */
public interface SourceSearcher {
  
  public static final Logger LOGGER = Logger.getLogger(SourceSearcher.class.getName());
  
  public JSONObject search(HttpServletRequest request);  
  public JSONObject relations(String[] carkody, String[] signatury);
  public long numFound(HttpServletRequest request);
}
 