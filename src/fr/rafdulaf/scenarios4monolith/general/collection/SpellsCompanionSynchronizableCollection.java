package fr.rafdulaf.scenarios4monolith.general.collection;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class SpellsCompanionSynchronizableCollection extends CompanionSynchronizableCollection
{
    @Override
    protected Map<String, List<String>> _getMapping(Map<String, Map<String, Object>> results)
   {
        return Map.of(
            "title", List.of("title"),
            "identifier", List.of("id"),
            "origins", List.of("origins"),
            "image", List.of("image"),
            "image2", List.of("image2")
        );
    }

    @Override
    protected void _adapt(Map<String, Map<String, Object>> finalData, String application)
    {
        for (Entry<String, Map<String, Object>> entry : finalData.entrySet())
        {
            Map<String, Object> data = entry.getValue();
            
            _adaptImageCardPreview(data);
        }
        
        super._adapt(finalData, application);
        
        String titleField = this._getMapping(null).get("title").get(0);
        
        // hidden name
        for (Entry<String, Map<String, Object>> entry : finalData.entrySet())
        {
            Map<String, Object> data = entry.getValue();
            
            if ("versus".equals(data.get("type")))
            {
                String name = data.get(titleField).toString();
                
                Map<String, Object> mapName = _jsonUtils.convertJsonToMap(name);

                for (String lang : mapName.keySet())
                {
                    String currentName = mapName.get(lang).toString();
                    mapName.put(lang, currentName + " (versus)");
                }
                
                data.put(titleField, _jsonUtils.convertObjectToJson(mapName));
            }
        }
    }
    
    private void _adaptImageCardPreview(Map<String, Object> data)
    {
        String id = (String) data.get("id");
        data.put("image2", "data/spells/img/" + id + "_cardpreview_LANG.webp");
    }
}
