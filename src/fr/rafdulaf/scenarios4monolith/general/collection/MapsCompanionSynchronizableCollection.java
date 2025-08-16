package fr.rafdulaf.scenarios4monolith.general.collection;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;

import org.ametys.runtime.config.Config;

public class MapsCompanionSynchronizableCollection extends CompanionSynchronizableCollection
{
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
            for (String key : listData.keySet())
            {
                _addLang(listData.get(key), localData.get(StringUtils.substringBefore(key, "#")), lang);
            }
        }
        for (Entry<String, Map<String, Object>> entry : listData.entrySet())
        {
            String sccId = entry.getKey();
            Object id = entry.getValue().get("id");
            Object title = entry.getValue().get("description/title");
            Object origins = entry.getValue().get("description/origins");
            
            finalData.put(sccId, Map.of(
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
            for (String key : partsData.keySet())
            {
                _addLang(partsData.get(key), localData.get(StringUtils.substringBefore(key, "#")), lang);
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
            for (String key : compositionsData.keySet())
            {
                _addLang(compositionsData.get(key), localData.get(StringUtils.substringBefore(key, "#")), lang);
            }
        }
        for (Object composition : (List) unflatenData.get("compositions"))
        {
            Map<String, Object> compo = (Map<String, Object>) composition;
            String id = (String) compo.get("id");
            Object title = compositionsData.get(id + "#1").get("description/title");
            Set<String> origins = new HashSet<>();
            
            Map<String, Object> zonesJson = (Map<String, Object>) compo.get("zones");
            for (String zone : zonesJson.keySet())
            {
                if (parts.containsKey(zone + "#1"))
                {
                    origins.addAll(parts.get(zone + "#1"));
                }
                else // if (lists.containsKey(zone + "#1"))
                {
                    origins.addAll((List<String>) finalData.get(zone + "#1").get("origins"));
                }
            }
            
            finalData.put(id + "#1", Map.of(
                "id", id,
                "title", title,
                "origins", origins
            ));
        }
        
        _adapt(finalData, StringUtils.substringBeforeLast(folder, "/"));

        _undobble(finalData);
        
        return finalData;
    }
}
