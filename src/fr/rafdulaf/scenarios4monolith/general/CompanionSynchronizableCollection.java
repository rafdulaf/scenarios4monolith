package fr.rafdulaf.scenarios4monolith.general;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;

import org.ametys.plugins.contentio.synchronize.impl.AbstractDefaultSynchronizableContentsCollection;

/**
 * Synchronize with the Companion data
 */
public class CompanionSynchronizableCollection extends AbstractDefaultSynchronizableContentsCollection
{
    public String getIdField()
    {
        return "id";
    }
    
    @Override
    protected Map<String, Map<String, Object>> internalSearch(Map<String, Object> searchParameters, int offset, int limit, List<Object> sort, Logger logger)
    {
        // TODO Auto-generated method stub
        return null;
    }
}
