package fr.rafdulaf.scenarios4monolith.general.collection;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class HeroesCompanionSynchronizableCollection extends CompanionSynchronizableCollection
{
    @Override
    protected Map<String, List<String>> _getMapping(Map<String, Map<String, Object>> results)
    {
        return Map.of(
            "title", List.of("name"),
            "identifier", List.of("id"),
            "origins", List.of("origins")
        );
    }
    
    
    @Override
    protected void _adapt(Map<String, Map<String, Object>> finalData)
    {
        for (Entry<String, Map<String, Object>> entry : finalData.entrySet())
        {
            Map<String, Object> data = entry.getValue();
            
            // First add subname to name
            if (data.containsKey("subname"))
            {
                String subname = data.get("subname").toString();
                String name = data.get("name").toString();
                
                Map<String, Object> mapName = _jsonUtils.convertJsonToMap(name);
                Map<String, Object> mapSubname = _jsonUtils.convertJsonToMap(subname);

                for (String lang : mapName.keySet())
                {
                    mapName.put(lang, mapName.get(lang) + " " + mapSubname.get(lang));
                }
                
                data.put("name", _jsonUtils.convertObjectToJson(mapName));
            }
        }
        
        super._adapt(finalData);
    }
}
