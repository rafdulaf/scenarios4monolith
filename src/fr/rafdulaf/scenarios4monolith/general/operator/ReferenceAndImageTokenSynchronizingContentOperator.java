package fr.rafdulaf.scenarios4monolith.general.operator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;

import org.ametys.cms.contenttype.ContentType;
import org.ametys.cms.repository.Content;
import org.ametys.cms.repository.ContentTypeExpression;
import org.ametys.plugins.repository.AmetysObjectIterable;
import org.ametys.plugins.repository.AmetysObjectIterator;
import org.ametys.plugins.repository.RepositoryConstants;
import org.ametys.plugins.repository.query.QueryHelper;
import org.ametys.plugins.repository.query.expression.AndExpression;
import org.ametys.plugins.repository.query.expression.Expression.Operator;
import org.ametys.plugins.repository.query.expression.StringExpression;
import org.ametys.runtime.i18n.I18nizableText;

public class ReferenceAndImageTokenSynchronizingContentOperator extends ReferenceSynchronizingContentOperator
{
    public I18nizableText getLabel()
    {
        return new I18nizableText("plugin.general", "SCC_JSON_REFERENCE_AND_TOKEN_OPERATOR");
    }

    public Map<String, List<Object>> transform(ContentType cType, Map<String, List<Object>> remoteValues, Logger logger)
    {
        super.transform(cType, remoteValues, logger);
        
        for (Entry<String, List<Object>> remoteValue : remoteValues.entrySet())
        {
            if (cType.hasModelItem(remoteValue.getKey()))
            {
                if ("image".equals(remoteValue.getKey()))
                {
                    List<Object> values = new ArrayList<>();
                    for (Object value : remoteValue.getValue())
                    {
                        String path = value.toString();
                        int i = path.lastIndexOf('.');
                        values.add(path.substring(0, i) + "-token" + path.substring(i));
                    }
                    remoteValue.setValue(values);
                }
            }
        }
        
        return remoteValues;
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


    public void additionalOperation(Content content, Map<String, List<Object>> remoteValues, Logger logger)
    {
        // Nothing
    }

}
