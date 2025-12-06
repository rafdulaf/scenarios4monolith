package fr.rafdulaf.scenarios4monolith.general.collection;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.avalon.framework.activity.Disposable;
import org.apache.avalon.framework.activity.Initializable;
import org.apache.avalon.framework.service.ServiceException;
import org.apache.avalon.framework.service.ServiceManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.io.CloseMode;
import org.slf4j.Logger;

import org.ametys.cms.repository.Content;
import org.ametys.cms.repository.ContentTypeExpression;
import org.ametys.cms.repository.ModifiableContent;
import org.ametys.cms.repository.WorkflowAwareContent;
import org.ametys.core.util.HttpUtils;
import org.ametys.core.util.JSONUtils;
import org.ametys.plugins.contentio.synchronize.impl.AbstractDefaultSynchronizableContentsCollection;
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
import org.ametys.runtime.model.View;

import com.opensymphony.workflow.WorkflowException;

/**
 * Synchronize with the Companion data
 */
public class CompanionSynchronizableCollection extends AbstractDefaultSynchronizableContentsCollection implements Initializable, Disposable
{
    protected JSONUtils _jsonUtils;
    private CloseableHttpClient _httpClient;
    private AmetysObjectResolver _ametysObjectResolver;

    @Override
    public void service(ServiceManager manager) throws ServiceException
    {
        super.service(manager);
        _jsonUtils = (JSONUtils) manager.lookup(JSONUtils.ROLE);
        _ametysObjectResolver = (AmetysObjectResolver) manager.lookup(AmetysObjectResolver.ROLE);
    }
    
    public void initialize() throws Exception
    {
        _httpClient = HttpUtils.createHttpClient(0, 30);
    }
    
    public String getIdField()
    {
        return "scc_identifier";
    }
    
    @SuppressWarnings("unchecked")
    @Override
    protected Map<String, List<String>> _getMapping(Map<String, Map<String, Object>> results)
    {
        String mappingField = (String) this.getParameterValues().get("mappingField");
        return (Map) _jsonUtils.convertJsonToMap(mappingField);
    }
    
    @SuppressWarnings("unchecked")
    protected Map<String, Map<String, Object>> _read(String url, String dataField)
    {
        try
        {
            // Prepare a request object
            HttpGet request = new HttpGet(url);
            
            // Execute the request
            return _httpClient.execute(request, response -> {
                if (response.getCode() != 200)
                {
                    throw new IllegalStateException("Could not join " + url + ". Error code " + response.getCode());
                }
                
                try
                {
                    String responseAsString = EntityUtils.toString(response.getEntity(), "UTF-8");
                    Map<String, Object> convertJsonToMap = _jsonUtils.convertJsonToMap(responseAsString);
                    Object data = StringUtils.isNotBlank(dataField) ? convertJsonToMap.get(dataField) : convertJsonToMap;
                    if (data instanceof Map m)
                    {
                        return (Map<String, Map<String, Object>>) m;
                    }
                    else if (data instanceof List l)
                    {
                        // Convert list to map using the id field
                        return _listToMap(l);
                    }
                    else
                    {
                        throw new IllegalStateException("Joined at " + url + ". But cannot parse the response " + data.getClass().getCanonicalName());
                    }
                }
                catch (IllegalArgumentException e)
                {
                    throw new IllegalStateException("Joined at " + url + ". But cannot parse the response.", e);
                }
            });
        }
        catch (IOException e)
        {
            throw new IllegalStateException("Could not join " + url, e);
        }
    }

    @SuppressWarnings("unchecked")
    protected Map<String, Map<String, Object>> _listToMap(List l)
    {
        Map<String, Map<String, Object>> result = new LinkedHashMap<>();
        
        for (Map<String, Object> item : (List<Map<String, Object>>) l)
        {
            int count = 1;
            if (item.containsKey("count"))
            {
                count = Integer.parseInt(item.get("count").toString());
            }
            
            if (item.containsKey("id"))
            {
                for (int i = 0; i < count; i++)
                {
                    String sccId = _findSCCId(item.get("id").toString(), result.keySet());
                    item.put("scc_indentifier", sccId);
                    result.put(sccId, item);
                }
            }
        }
        
        return result;
    }
    
    private String _findSCCId(String string, Set<String> keySet)
    {
        int i = 1;
        while (true)
        {
            String candidate = string + "#" + i;
            if (!keySet.contains(candidate))
            {
                return candidate;
            }
            i++;
        }
    }

    @Override
    protected Map<String, Map<String, Object>> internalSearch(Map<String, Object> searchParameters, int offset, int limit, List<Object> sort, Logger logger)
    {
        String baseUrl = Config.getInstance().getValue("companion.base.url");
        String folder = (String) this.getParameterValues().get("folder");
        String file = (String) this.getParameterValues().get("file");
        String dataField = (String) this.getParameterValues().get("data");
        String[] languages = StringUtils.split((String) this.getParameterValues().get("languages"), ", ");
        
        Map<String, Map<String, Object>> data = _flat(_read(baseUrl + "/" + folder + "/" + file + ".json", dataField));
        for (String lang : languages)
        {
            Map<String, Map<String, Object>> localData = _flat(_read(baseUrl + "/" + folder + "/" + file + "/lang/" + file + "." + lang + ".json", dataField));
            for (String key : data.keySet())
            {
                _addLang(data.get(key), localData.get(StringUtils.substringBefore(key, "#")), lang);
            }
        }
        
        _adapt(data, StringUtils.substringBeforeLast(folder, "/"));
        
        _undobble(data);
        
        return data;
    }
    
    protected void _adapt(Map<String, Map<String, Object>> finalData, String application)
    {
        String titleField = this._getMapping(null).get("title").get(0);
        
        // hidden name
        for (Entry<String, Map<String, Object>> entry : finalData.entrySet())
        {
            Map<String, Object> data = entry.getValue();
            
            // First add subname to name
            if (data.containsKey("hiddenName"))
            {
                String subname = data.get("hiddenName").toString();
                String name = data.get(titleField).toString();
                
                Map<String, Object> mapName = _jsonUtils.convertJsonToMap(name);
                Map<String, Object> mapSubname = _jsonUtils.convertJsonToMap(subname);

                for (String lang : mapName.keySet())
                {
                    String currentName = mapName.get(lang).toString();
                    mapName.put(lang, currentName + (StringUtils.isBlank(currentName) ? "" : " ") + mapSubname.get(lang));
                }
                
                data.put(titleField, _jsonUtils.convertObjectToJson(mapName));
            }
            
            // Second add subid
            if (data.containsKey("subid"))
            {
                String subname = data.get("subid").toString();
                String name = data.get(titleField).toString();
                
                Map<String, Object> mapName = _jsonUtils.convertJsonToMap(name);

                for (String lang : mapName.keySet())
                {
                    String currentName = mapName.get(lang).toString();
                    mapName.put(lang, currentName + " " + subname);
                }
                
                data.put(titleField, _jsonUtils.convertObjectToJson(mapName));
            }
            
        }
        
        String imageField = this._getMapping(null).containsKey("image") ? this._getMapping(null).get("image").get(0) : null;
        String image2Field = this._getMapping(null).containsKey("image2") ? this._getMapping(null).get("image2").get(0) : null;
        if (imageField != null || image2Field != null)
        {
            for (Entry<String, Map<String, Object>> entry : finalData.entrySet())
            {
                Map<String, Object> data = entry.getValue();
                
                if (imageField != null && data.containsKey(imageField))
                {
                    String image = Objects.toString(data.get(imageField));
                    if (StringUtils.isNotBlank(image))
                    {
                        entry.getValue().put(imageField, application + "/" + image);
                    }
                }
                if (image2Field != null && data.containsKey(image2Field))
                {
                    String image2 = Objects.toString(data.get(image2Field));
                    if (StringUtils.isNotBlank(image2))
                    {
                        entry.getValue().put(image2Field, application + "/" + image2);
                    }
                }
            }
        }
    }

    protected List<Set<String>> _getDobbleElementsByTitle(Map<String, Map<String, Object>> finalData, String titleField, String identifierField)
    {
        Map<String, Set<Pair<String, String>>> titles = new HashMap<>();
        for (Entry<String, Map<String, Object>> entry : finalData.entrySet())
        {
            String id = entry.getValue().get(identifierField).toString();
            String title = (String) entry.getValue().get(titleField);
            
            Set<Pair<String, String>> t = titles.computeIfAbsent(title, tt -> new HashSet<>());
            
            /* Remove id and color index id#i#color#j (if color exists (on tile only)) */
            String[] splitId = StringUtils.split(entry.getKey(), "#");
            t.add(Pair.of(id, splitId[0] + "#" + splitId[splitId.length > 2 ? 2 : 1]));
        }
        return titles.values().stream().filter(t -> t.size() > 1).map(v -> v.stream().map(vv -> vv.getLeft()).collect(Collectors.toSet())).distinct().toList();
    }
    
    protected Map<String, Map<String, Object>> _getElementsByIdentifier(String identifier, Map<String, Map<String, Object>> finalData, String identifierField)
    {
        return finalData.entrySet().stream().filter(e -> e.getValue().get(identifierField).toString().equals(identifier)).collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue()));
    }

    protected void _undobble(Map<String, Map<String, Object>> finalData)
    {
        String identifierField = this._getMapping(null).get("identifier").get(0);
        String titleField = this._getMapping(null).get("title").get(0);
        
        _undobble(finalData, identifierField, titleField);
        
        List<Set<String>> dobbles = _getDobbleElementsByTitle(finalData, titleField, identifierField);
        if (dobbles.size() >= 1)
        {
            throw new IllegalStateException("Dobbles at the end... " + dobbles.size() + " dobbles. For example: " + dobbles.get(0));
        }
    }

    protected void _undobble(Map<String, Map<String, Object>> finalData, String identifierField, String titleField)
    {
        _undobbleByOrigins(finalData, identifierField, titleField);
    }
    
    protected void _undobbleByOrigins(Map<String, Map<String, Object>> finalData, String identifierField, String titleField)
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
                    
                    @SuppressWarnings("unchecked")
                    List<String> origins = (List) data.get("origins");
                    if (origins != null)
                    {
                        List<MultilingualString> originsShorts = origins.stream().map(o -> _getContentByIdentifier(o, "conan-expansion")).map(o -> (MultilingualString) o.getValue("short")).toList();
                        
                        Map<String, Object> titleData = _jsonUtils.convertJsonToMap((String) data.get(titleField));
                        for (Entry<String, Object> titleLang : titleData.entrySet())
                        {
                            titleLang.setValue(titleLang.getValue() + " (" + originsShorts.stream().map(ml -> ml.getValue(Locale.of(titleLang.getKey()))).collect(Collectors.joining(" ,")) + ")");
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
    
    private Content _getContentByIdentifier(String identifier, String contentType)
    {
        ContentTypeExpression allProjects = new  ContentTypeExpression(Operator.EQ, contentType);
        StringExpression identifierExpresion = new StringExpression("identifier", Operator.EQ, identifier);
        AndExpression exp = new AndExpression(allProjects, identifierExpresion);
        
        try (AmetysObjectIterable<Content> contents = _ametysObjectResolver.query(QueryHelper.getXPathQuery(null, RepositoryConstants.NAMESPACE_PREFIX + ":content", exp)))
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

    protected Map<String, Map<String, Object>> _flat(Map<String, Map<String, Object>> data)
    {
        Map<String, Map<String, Object>> finalMap = new LinkedHashMap<>();
        
        for (String key : data.keySet())
        {
            Map<String, Object> miniMap = new LinkedHashMap<>();
            _doFlat(data.get(key), miniMap, "");
            finalMap.put(key, miniMap);
        }
        
        return finalMap;
    }

    protected void _doFlat(Map<String, Object> data, Map<String, Object> result, String prefix)
    {
        for (Entry<String, Object> entry : data.entrySet())
        {
            _underFlat(entry.getValue(), result, prefix + entry.getKey());
        }
    }
    @SuppressWarnings("unchecked")
    protected void _underFlat(Object object, Map<String, Object> result, String prefix)
    {
        switch (object)
        {
            case null -> result.put(prefix, null);
            case Number n -> result.put(prefix, n);
            case Boolean b -> result.put(prefix, b);
            case String s -> result.put(prefix, s);
            case Map m -> _doFlat(m, result, prefix + "/");
            case List l -> {
                if (l.size() == 0 || l.get(0) instanceof Number || l.get(0) instanceof Boolean || l.get(0) instanceof String)
                {
                    result.put(prefix, l);
                    return;
                }
                else
                {
                    for (int i=0; i<l.size(); i++)
                    {
                        _underFlat(l.get(i), result, prefix + "[" + i + "]");
                    }
                }
            }
            default -> throw new IllegalStateException("Cannot flatten " + object.getClass().toString() + " value for " + prefix);
        }
    }
    
    protected void _addLang(Map<String, Object> data, Map<String, Object> localData, String lang)
    {
        for (Entry<String, Object> entry : localData.entrySet())
        {
            if (entry.getValue() instanceof String | entry.getValue() instanceof Number | entry.getValue() instanceof Boolean | entry.getValue() == null)
            {
                String existing = (String) data.computeIfAbsent(entry.getKey(), l -> "{}");
                Map<String, Object> json = _jsonUtils.convertJsonToMap(existing);
                json.put(lang, entry.getValue());
                data.put(entry.getKey(), _jsonUtils.convertObjectToJson(json));
            }
            else
            {
                throw new IllegalStateException("Cannot merge " + entry.getValue().getClass().toString() + " value for " + entry.getKey() + " in lang " + lang);
            }
        }
    }

    @Override
    public ModifiableContent getContent(String lang, String idValue, boolean forceStrictCheck)
    {
        // Ignore language for multilingual reference table
        return super.getContent(null, idValue, forceStrictCheck);
    }
    
    @Override
    protected ModifiableContent createContentAction(String contentType, String workflowName, int initialActionId, String lang, String contentTitle, Logger logger)
    {
        try
        {
            logger.info("Creating content '{}' with the content type '{}' for language {}", contentTitle, getContentType(), lang);
            
            Map<String, Object> inputs = _getAdditionalInputsForContentCreation();
            Map<String, Object> result;
            
            if ("-".equals(lang))
            {
                // The title is a JSON object, we use it as is
                @SuppressWarnings({"unchecked"})
                Map<String, String> titleVariants = (Map) _jsonUtils.convertJsonToMap(contentTitle);
                String desiredContentName = _contentPrefix + "-" + titleVariants.get("en") + "-" + lang;
                result = _contentWorkflowHelper.createContent(
                        workflowName,
                        initialActionId,
                        desiredContentName,
                        titleVariants,
                        new String[] {contentType},
                        null,
                        inputs);
            }
            else
            {
                String desiredContentName = _contentPrefix + "-" + contentTitle + "-" + lang;
                result = _contentWorkflowHelper.createContent(
                        workflowName,
                        initialActionId,
                        desiredContentName,
                        contentTitle,
                        new String[] {contentType},
                        null,
                        lang,
                        inputs);
            }
            
            return (ModifiableContent) result.get(Content.class.getName());
        }
        catch (WorkflowException e)
        {
            _nbError++;
            logger.error("Failed to initialize workflow for content {} and language {}", contentTitle, lang, e);
            return null;
        }
    }
    
    @Override
    protected boolean _editContent(WorkflowAwareContent content, Optional<View> view, Map<String, Object> values, Map<String, Object> additionalParameters, boolean create, Set<String> notSynchronizedContentIds, Logger logger) throws WorkflowException
    {
        for (String key : values.keySet())
        {
            if ("multilingual-string".equals(content.getDefinition(key).getType().getId()))
            {
                MultilingualString ms = new MultilingualString();
                
                @SuppressWarnings("unchecked")
                Map<String, String> titleVariants = (Map) _jsonUtils.convertJsonToMap((String) values.get(key));
                titleVariants.entrySet().stream().forEach(e -> ms.add(Locale.forLanguageTag(e.getKey()), e.getValue()));
                
                values.put(key, ms);
            }
        }
        
        return super._editContent(content, view, values, additionalParameters, create, notSynchronizedContentIds, logger);
    }
    
    public void dispose()
    {
        _httpClient.close(CloseMode.GRACEFUL);
    }
}
