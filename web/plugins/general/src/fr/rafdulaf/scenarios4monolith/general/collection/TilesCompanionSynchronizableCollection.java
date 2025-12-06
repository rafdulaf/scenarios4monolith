package fr.rafdulaf.scenarios4monolith.general.collection;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

public class TilesCompanionSynchronizableCollection extends CompanionSynchronizableCollection
{
    @Override
    protected Map<String, List<String>> _getMapping(Map<String, Map<String, Object>> results)
    {
        return Map.of(
            "title", List.of("name"),
            "identifier", List.of("id"),
            "origins", List.of("origins"),
            "image", List.of("image"),
            "image2", List.of("image2"),
            "color", List.of("color")
        );
    }
    
    @SuppressWarnings("unchecked")
    @Override
    protected void _adapt(Map<String, Map<String, Object>> finalData, String application)
    {
        // colors
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
                    _adaptImageCardPreview(coloredData);
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
        
        super._adapt(finalData, application);
    }
    
    private void _adaptImageCardPreview(Map<String, Object> data)
    {
        String color = (String) data.get("color");
        
        if ("none".equals(color))
        {
            String img = (String) data.get("image");
            int i = img.lastIndexOf('.');
            data.put("image2", img.substring(0, i) + "_cardpreview_LANG" + img.substring(i));
        }
        else
        {
            String id = (String) data.get("id");
            data.put("image2", "data/tiles/img/" + id + "_" + color + "_cardpreview_LANG.webp");
        }
    }

    protected void _undobble(Map<String, Map<String, Object>> finalData, String identifierField, String titleField)
    {
        _undobbleByColors(finalData, identifierField, titleField);
        _undobbleByOrigins(finalData, identifierField, titleField);
        _undobbleBySkills(finalData, identifierField, titleField);
    }

    private void _undobbleByColors(Map<String, Map<String, Object>> finalData, String identifierField, String titleField)
    {
        // Lookup for dobbles
        List<Set<String>> dobbles = _getDobbleElementsByTitle(finalData, titleField, identifierField);
        
        for (Set<String> dobbleIds : dobbles)
        {
            Set<String> newTitles = new HashSet<>();
            Map<String, Map<String, Object>> dataToUpdate = new HashMap<>();
            
            for (String id : dobbleIds)
            {
                
                for(Map.Entry<String, Map<String, Object>> entry : _getElementsByIdentifier(id, finalData, identifierField).entrySet())
                {
                    Map<String, Object> data = entry.getValue();
                    
                    String color = data.get("color").toString();
                    if (color != null)
                    {
                        Map<String, Object> titleData = _jsonUtils.convertJsonToMap((String) data.get(titleField));
                        for (Entry<String, Object> titleLang : titleData.entrySet())
                        {
                            titleLang.setValue(titleLang.getValue() + " (" + color + ")");
                        }
                        String newTitle = _jsonUtils.convertObjectToJson(titleData);
                        
                        Map<String, Object> newData = new LinkedHashMap<>(data);
                        newData.put(titleField, newTitle);
                        dataToUpdate.put(entry.getKey(), newData);
                        
                        newTitles.add(newTitle);
                    }
                    else
                    {
                        newTitles.add(data.get(titleField).toString());
                    }
                }
            }
            
            if (newTitles.size() > 1) // Otherwise titles are still equals (not interesting)
            {
                finalData.putAll(dataToUpdate);
            }
        }
    }
    
    private String _addNotNoneSkill(String skill, String skill0)
    {
        if (StringUtils.isNotBlank(skill0) && !"none".equals(skill0))
        {
            return skill + (skill.length() > 0 ? ", " : "") + StringUtils.substringAfter(skill0, "/");
        }
        else
        {
            return skill;
        }
    }

    @SuppressWarnings("unchecked")
    private void _undobbleBySkills(Map<String, Map<String, Object>> finalData, String identifierField, String titleField)
    {
        // Lookup for dobbles
        List<Set<String>> dobbles = _getDobbleElementsByTitle(finalData, titleField, identifierField);
        
        for (Set<String> dobbleIds : dobbles)
        {
            Set<String> newTitles = new HashSet<>();
            Map<String, Map<String, Object>> dataToUpdate = new HashMap<>();
            
            for (String id : dobbleIds)
            {
                
                for(Map.Entry<String, Map<String, Object>> entry : _getElementsByIdentifier(id, finalData, identifierField).entrySet())
                {
                    Map<String, Object> data = entry.getValue();
                
                    String skill = "";
                    skill = _addNotNoneSkill(skill, (String) data.get("skills/0"));
                    skill = _addNotNoneSkill(skill, (String) data.get("skills/1"));
                    skill = _addNotNoneSkill(skill, (String) data.get("skills/2"));
                    skill = _addNotNoneSkill(skill, (String) data.get("skills/3"));
                    
                    if (StringUtils.isNotBlank(skill))
                    {
                        Map<String, Object> titleData = _jsonUtils.convertJsonToMap((String) data.get(titleField));
                        for (Entry<String, Object> titleLang : titleData.entrySet())
                        {
                            titleLang.setValue(titleLang.getValue() + " (" + skill + ")");
                        }
                        String newTitle = _jsonUtils.convertObjectToJson(titleData);
                        
                        Map<String, Object> newData = new LinkedHashMap<>(data);
                        newData.put(titleField, newTitle);
                        dataToUpdate.put(entry.getKey(), newData);
                        
                        newTitles.add(newTitle);
                    }
                    else
                    {
                        newTitles.add(data.get(titleField).toString());
                    }
                }
            }
            
            if (newTitles.size() > 1) // Otherwise titles are still equals (not interesting)
            {
                finalData.putAll(dataToUpdate);
            }
        }
    }
}
