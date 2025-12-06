package fr.rafdulaf.scenarios4monolith.general.collection;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

/**
 * Sync for equipment cards
 */
public class EquipmentsSynchronizableCollection extends CompanionSynchronizableCollection
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
    }
    
    private void _adaptImageCardPreview(Map<String, Object> data)
    {
        String id = (String) data.get("id");
        
        String image = (String) data.get("image");
        String imageId = StringUtils.removeEnd(StringUtils.substringAfterLast(image, "/"), ".webp");
        
        if (imageId == null)
        {
            imageId = id;
        }
        data.put("image2", "data/equipments/img/" + imageId + "_cardpreview_LANG.webp");
    }

    @Override
        protected List<Set<String>> _getDobbleElementsByTitle(Map<String, Map<String, Object>> finalData, String titleField, String identifierField)
        {
            return super._getDobbleElementsByTitle(finalData, titleField, identifierField).stream().filter(set -> set.size() > 1).toList();
        }
}
