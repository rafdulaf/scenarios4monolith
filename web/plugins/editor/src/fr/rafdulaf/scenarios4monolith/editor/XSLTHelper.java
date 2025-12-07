package fr.rafdulaf.scenarios4monolith.editor;

import java.util.Map;

import org.apache.avalon.framework.activity.Initializable;
import org.apache.avalon.framework.service.ServiceException;
import org.apache.avalon.framework.service.ServiceManager;
import org.apache.commons.lang3.StringUtils;

import org.ametys.cms.repository.Content;
import org.ametys.cms.repository.ContentTypeExpression;
import org.ametys.core.util.dom.MapElement;
import org.ametys.plugins.repository.AmetysObjectIterable;
import org.ametys.plugins.repository.AmetysObjectResolver;
import org.ametys.plugins.repository.RepositoryConstants;
import org.ametys.plugins.repository.query.QueryHelper;
import org.ametys.plugins.repository.query.expression.AndExpression;
import org.ametys.plugins.repository.query.expression.Expression.Operator;
import org.ametys.plugins.repository.query.expression.StringExpression;
import org.ametys.runtime.config.Config;
import org.ametys.runtime.plugin.component.DeferredServiceable;

public class XSLTHelper implements DeferredServiceable, Initializable
{
    private static AmetysObjectResolver _resolver;

    public void deferredService(ServiceManager manager) throws ServiceException
    {
        _resolver = (AmetysObjectResolver) manager.lookup(AmetysObjectResolver.ROLE);
    }

    public void initialize() throws Exception
    {
        // To be instanced once
    }
    
    public static MapElement getScenarioElementInfo(String scenarioElementInfo)
    {
        String contentType = StringUtils.substringBefore(scenarioElementInfo, "#");
        String color = StringUtils.substringAfterLast(scenarioElementInfo, "#");
        String identifier = scenarioElementInfo.substring(contentType.length() + 1, scenarioElementInfo.length() - color.length() - 1);
        
        ContentTypeExpression allContents = new  ContentTypeExpression(Operator.EQ, contentType);
        StringExpression identifierExpression = new StringExpression("identifier", Operator.EQ, identifier);
        
        AndExpression exp = new AndExpression(allContents, identifierExpression);
        
        AmetysObjectIterable<Content> contents = _resolver.query(QueryHelper.getXPathQuery(null, RepositoryConstants.NAMESPACE_PREFIX + ":content", exp));
        if (contents.getSize() == 0)
        {
            return null;
        }
        else
        {
            Content found = contents.iterator().next();
            String baseUrl = Config.getInstance().getValue("companion.base.url");
            
            return new MapElement("info", Map.of(
                    "title", found.getTitle(),
                    "image1", baseUrl + "/" + found.getValue("image", false, "").replace("LANG", "en"),
                    "image2", baseUrl + "/" + found.getValue("image2", false, "").replace("LANG", "en")
            ));
        }
    }
}
