package fr.rafdulaf.scenarios4monolith.general;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.avalon.framework.service.ServiceException;
import org.apache.avalon.framework.service.ServiceManager;
import org.slf4j.Logger;

import org.ametys.cms.contenttype.ContentType;
import org.ametys.core.util.JSONUtils;
import org.ametys.runtime.i18n.I18nizableText;

public class HeroesSynchronizingContentOperator extends ReferenceSynchronizingContentOperator
{
    private JSONUtils _jsonµUtils;

    @Override
    public void service(ServiceManager manager) throws ServiceException
    {
        super.service(manager);
        
        _jsonµUtils = (JSONUtils) manager.lookup(JSONUtils.ROLE);
    }
    
    @Override
    public I18nizableText getLabel()
    {
        return new I18nizableText("plugin.general", "SCC_JSON_HEORES_OPERATOR");
    }
    
    public Map<String, List<Object>> transform(ContentType cType, Map<String, List<Object>> remoteValues, Logger logger)
    {
        Map<String, List<Object>> data = super.transform(cType, remoteValues, logger);
        
        if (data.containsKey("subname"))
        {
            List<Object> subname = data.get("subname");
            if (subname.size() > 0)
            {
                List<Object> newtitle = new ArrayList<>();
                
                List<Object> title = data.get("title");
                for (int i=0; i<title.size(); i++)
                {
                    String t = (String) title.get(i);
                    String s = (String) subname.get(i);
                    
                    Map<String, Object> mt = _jsonµUtils.convertJsonToMap(t);
                    Map<String, Object> ms = _jsonµUtils.convertJsonToMap(s);

                    for (String lang : mt.keySet())
                    {
                        mt.put(lang, mt.get(lang) + " " + ms.get(lang));
                    }
                    
                    newtitle.add(_jsonµUtils.convertObjectToJson(mt));
                }
                
                data.put("title", newtitle);
            }
            
            data.remove("subname");
        }
        
        return data;
    }
}
