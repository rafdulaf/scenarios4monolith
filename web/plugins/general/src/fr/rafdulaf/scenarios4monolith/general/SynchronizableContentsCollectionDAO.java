package fr.rafdulaf.scenarios4monolith.general;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;

import org.apache.avalon.framework.service.ServiceException;
import org.apache.avalon.framework.service.ServiceManager;

import org.ametys.cms.contenttype.ContentType;
import org.ametys.cms.contenttype.ContentTypeExtensionPoint;
import org.ametys.core.ui.Callable;
import org.ametys.runtime.i18n.I18nizableText;

public class SynchronizableContentsCollectionDAO extends org.ametys.plugins.contentio.synchronize.SynchronizableContentsCollectionDAO
{
    private ContentTypeExtensionPoint _contentTypeEP;

    
    @Override
    public void service(ServiceManager smanager) throws ServiceException
    {
        super.service(smanager);
        _contentTypeEP = (ContentTypeExtensionPoint) smanager.lookup(ContentTypeExtensionPoint.ROLE);
    }
    
    @Override
    @Callable (rights = "Runtime_Rights_Admin_Access", context = "/admin")
    public Map<String, Object> getEditionConfiguration() throws Exception
    {
        Map<String, Object> result = super.getEditionConfiguration();
        
        // CONTENT TYPES
        result.put(
            "contentTypes",
            _transformToJSONEnumerator(
                _contentTypeEP.getExtensionsIds().stream().map(_contentTypeEP::getExtension).filter(this::_isValidContentType),
                ContentType::getId,
                ContentType::getLabel
            )
        );
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> languages = new ArrayList<>((List<Map<String, Object>>) result.get("languages"));
        languages.add(Map.of("value", "-", "label", new I18nizableText("-")));
        result.put("languages", languages);
        
        return result;
    }
    
    private <T> List<Map<String, Object>> _transformToJSONEnumerator(Stream<T> values, Function<T, String> valueFunction, Function<T, I18nizableText> labelFunction)
    {
        return values.map(value ->
                Map.of(
                    "value", valueFunction.apply(value),
                    "label", labelFunction.apply(value)
                )
            )
            .toList();
    }
    
    private boolean _isValidContentType (ContentType cType)
    {
        return !cType.isAbstract() && !cType.isMixin();
    }
}
