package fr.rafdulaf.scenarios4monolith.general;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.avalon.framework.service.ServiceException;
import org.apache.avalon.framework.service.ServiceManager;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;

import org.ametys.cms.repository.Content;
import org.ametys.cms.repository.ContentTypeExpression;
import org.ametys.plugins.repository.AmetysObjectIterable;
import org.ametys.plugins.repository.AmetysObjectIterator;
import org.ametys.plugins.repository.AmetysObjectResolver;
import org.ametys.plugins.repository.RepositoryConstants;
import org.ametys.plugins.repository.metadata.MultilingualString;
import org.ametys.plugins.repository.query.QueryHelper;
import org.ametys.plugins.repository.query.expression.AndExpression;
import org.ametys.plugins.repository.query.expression.Expression.Operator;
import org.ametys.plugins.repository.query.expression.StringExpression;
import org.ametys.runtime.config.Config;

public class MapsCompanionSynchronizableCollection extends CompanionSynchronizableCollection
{
    private AmetysObjectResolver _ametysObjectResovler;

    @Override
    public void service(ServiceManager manager) throws ServiceException
    {
        super.service(manager);
        _ametysObjectResovler = (AmetysObjectResolver) manager.lookup(AmetysObjectResolver.ROLE);
    }
    
    @Override
    protected Map<String, List<String>> _getMapping(Map<String, Map<String, Object>> results)
   {
        return Map.of(
            "title", List.of("title"),
            "identifier", List.of("id"),
            "origins", List.of("origins")
        );
    }
    
    @SuppressWarnings("unchecked")
    @Override
    protected Map<String, Map<String, Object>> internalSearch(Map<String, Object> searchParameters, int offset, int limit, List<Object> sort, Logger logger)
    {
        Map<String, Map<String, Object>> finalData = new LinkedHashMap<>();
        
        // Params
        String baseUrl = Config.getInstance().getValue("companion.base.url");
        String folder = (String) this.getParameterValues().get("folder");
        String file = "maps";
        String[] languages = StringUtils.split((String) this.getParameterValues().get("languages"), ", ");

        // Read from remote server
        Map<String, Map<String, Object>> unflatenData = _read(baseUrl + "/" + folder + "/" + file + ".json", null);
        Map<String, Map<String, Map<String, Object>>> unflatenDataByLanguage = new LinkedHashMap<>();
        for (String lang : languages)
        {
            unflatenDataByLanguage.put(lang, _read(baseUrl + "/" + folder + "/" + file + "/lang/" + file + "." + lang + ".json", null));
        }
        
        // List
        Map<String, Map<String, Object>> listData = _flat(_listToMap((List) unflatenData.get("list")));
        for (String lang : languages)
        {
            Map<String, Map<String, Object>> localData = _flat((Map) unflatenDataByLanguage.get(lang).get("list"));
            for (String key : localData.keySet())
            {
                _addLang(listData.get(key), localData.get(key), lang);
            }
        }
        for (Entry<String, Map<String, Object>> entry : listData.entrySet())
        {
            String id = entry.getKey();
            Object title = entry.getValue().get("description/title");
            Object origins = entry.getValue().get("description/origins");
            
            finalData.put(id, Map.of(
                "id", id,
                "title", title,
                "origins", origins
            ));
        }
        
        // Next read parts
        Map<String, List<String>> parts = new LinkedHashMap<>();
        Map<String, Map<String, Object>> partsData = _flat(_listToMap((List) unflatenData.get("parts")));
        for (String lang : languages)
        {
            Map<String, Map<String, Object>> localData = _flat((Map) unflatenDataByLanguage.get(lang).get("parts"));
            for (String key : localData.keySet())
            {
                _addLang(partsData.get(key), localData.get(key), lang);
            }
        }
        for (Entry<String, Map<String, Object>> entry : partsData.entrySet())
        {
            parts.put(entry.getKey(), (List<String>) entry.getValue().get("description/origins"));
        }
        
        // Finally read compositions
        Map<String, Map<String, Object>> compositionsData = _flat(_listToMap((List) unflatenData.get("compositions")));
        for (String lang : languages)
        {
            Map<String, Map<String, Object>> localData = _flat((Map) unflatenDataByLanguage.get(lang).get("compositions"));
            for (String key : localData.keySet())
            {
                _addLang(compositionsData.get(key), localData.get(key), lang);
            }
        }
        for (Object composition : (List) unflatenData.get("compositions"))
        {
            Map<String, Object> compo = (Map<String, Object>) composition;
            String id = (String) compo.get("id");
            Object title = compositionsData.get(id).get("description/title");
            Set<String> origins = new HashSet<>();
            
            Map<String, Object> zonesJson = (Map<String, Object>) compo.get("zones");
            for (String zone : zonesJson.keySet())
            {
                if (parts.containsKey(zone))
                {
                    origins.addAll(parts.get(zone));
                }
                else // if (lists.containsKey(zone))
                {
                    origins.addAll((List<String>) finalData.get(zone).get("origins"));
                }
            }
            
            finalData.put(id, Map.of(
                "id", id,
                "title", title,
                "origins", origins
            ));
        }
        
        // Lookup for dobbles
        Map<String, List<String>> titles = new HashMap<>();
        for (Entry<String, Map<String, Object>> entry : finalData.entrySet())
        {
            String id = entry.getKey();
            String title = (String) entry.getValue().get("title");
            
            List<String> t = titles.computeIfAbsent(title, tt -> new ArrayList<>());
            t.add(id);
        }
        titles.values().stream().filter(t -> t.size() > 1).forEach(t ->
        {
            for (String id : t)
            {
                Map<String, Object> data = finalData.get(id);
                
                List<String> origins = (List) data.get("origins");
                List<MultilingualString> originsShorts = origins.stream().map(o -> _getContentByIdentifier(o, "conan-expansion")).map(o -> (MultilingualString) o.getValue("short")).toList();
                
                Map<String, Object> titleData = _jsonUtils.convertJsonToMap((String) data.get("title"));
                for (Entry<String, Object> titleLang : titleData.entrySet())
                {
                    titleLang.setValue(titleLang.getValue() + " (" + originsShorts.stream().map(ml -> ml.getValue(Locale.of(titleLang.getKey()))).collect(Collectors.joining(" ,")) + ")");
                }
                String newTitle = _jsonUtils.convertObjectToJson(titleData);
                
                
                finalData.put(id, Map.of(
                    "id", id,
                    "title", newTitle,
                    "origins", data.get("origins")
                ));
            }
        });
        
        return finalData;
    }
    
    private Content _getContentByIdentifier(String identifier, String contentType)
    {
        ContentTypeExpression allProjects = new  ContentTypeExpression(Operator.EQ, contentType);
        StringExpression identifierExpresion = new StringExpression("identifier", Operator.EQ, identifier);
        AndExpression exp = new AndExpression(allProjects, identifierExpresion);
        
        try (AmetysObjectIterable<Content> contents = _ametysObjectResovler.query(QueryHelper.getXPathQuery(null, RepositoryConstants.NAMESPACE_PREFIX + ":content", exp)))
        {
            AmetysObjectIterator<Content> iterator = contents.iterator();
            if (!iterator.hasNext())
            {
                return null;
            }
            else
            {
                return iterator.next();
            }
        }
    }

}
