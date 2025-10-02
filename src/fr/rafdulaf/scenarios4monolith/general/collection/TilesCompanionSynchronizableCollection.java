package fr.rafdulaf.scenarios4monolith.general.collection;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class TilesCompanionSynchronizableCollection extends CompanionSynchronizableCollection
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
    
    @SuppressWarnings("unchecked")
    @Override
    protected void _undobble(Map<String, Map<String, Object>> finalData)
    {
        Map<String, Map<String, Object>> newData = new LinkedHashMap<>();
        
        for (Entry<String, Map<String, Object>> entry : finalData.entrySet())
        {
            Map<String, Object> data = entry.getValue();
            
            // First add subname to name
            if (data.containsKey("colors"))
            {
                List<String> colors = (List) data.get("colors");
                data.remove("colors");
                
                int i = 1;
                for (String color : colors)
                {
                    Map<String, Object> coloredData = new LinkedHashMap<>(data);
                    coloredData.put("color", color);
                    newData.put(entry.getKey() + "#" + color + "#" + i++, coloredData);
                }
                
            }
            else
            {
                newData.put(entry.getKey(), data);
            }
        }
        
        finalData.clear();
        finalData.putAll(newData);
        
        super._undobble(finalData);
    }
}
