package fr.rafdulaf.scenarios4monolith.general;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.avalon.framework.service.ServiceException;
import org.apache.avalon.framework.service.ServiceManager;
import org.slf4j.Logger;

import org.ametys.cms.repository.Content;
import org.ametys.cms.repository.ModifiableContent;
import org.ametys.cms.repository.WorkflowAwareContent;
import org.ametys.core.util.JSONUtils;
import org.ametys.plugins.contentio.synchronize.impl.AbstractDefaultSynchronizableContentsCollection;
import org.ametys.plugins.repository.metadata.MultilingualString;
import org.ametys.runtime.model.View;

import com.opensymphony.workflow.WorkflowException;

/**
 * Synchronize with the Companion data
 */
public class CompanionSynchronizableCollection extends AbstractDefaultSynchronizableContentsCollection
{
    private JSONUtils _jsonUtils;

    @Override
        public void service(ServiceManager manager) throws ServiceException
        {
            super.service(manager);
            _jsonUtils = (JSONUtils) manager.lookup(JSONUtils.ROLE);
        }
    
    public String getIdField()
    {
        return "identifier";
    }
    
    @Override
    protected Map<String, Map<String, Object>> internalSearch(Map<String, Object> searchParameters, int offset, int limit, List<Object> sort, Logger logger)
    {
        // TODO
        return Map.of(
            "carbu", Map.of("identifier", "carbu", "title", "{\"fr\": \"Carburant\", \"en\": \"Fuel\"}", "type", "Essence")
        );
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
        if (values.containsKey("title")
            && "multilingual-string".equals(content.getDefinition("title").getType().getId()))
        {
            MultilingualString title = new MultilingualString();
            
            @SuppressWarnings("unchecked")
            Map<String, String> titleVariants = (Map) _jsonUtils.convertJsonToMap((String) values.get("title"));
            titleVariants.entrySet().stream().forEach(e -> title.add(Locale.forLanguageTag(e.getKey()), e.getValue()));
            
            values.put("title", title);
        }
        
        return super._editContent(content, view, values, additionalParameters, create, notSynchronizedContentIds, logger);
    }
}
