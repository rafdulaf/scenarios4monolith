Ext.define('Ametys.scenario.Links.ScenarioElementLinkHandler', {
    extend: 'Ametys.cms.editor.LinkHandler',
    
    edit: function (href)
    {
        Ametys.scenario.Links._doInsertScenarioElementLink(href);
    },
    
    getTypeName: function()
    {
        return "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_LABEL}}";
    },
    
    getTitle: function(href)
    {
        var response = Ametys.data.ServerComm.send({
            plugin: 'cms',
            url: 'contents/info',
            parameters: {id: href}, 
            priority: Ametys.data.ServerComm.PRIORITY_SYNCHRONOUS 
        });
        if (response == null || response.getAttribute("code") == "500" || response.getAttribute("code") == "404" || Ext.dom.Query.selectNode('resources > resource', response) == null)
        {
            return "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_ERROR_TITLE}}";
        }
        
        return Ext.dom.Query.selectNode('contents > content', response).getAttribute("title");
    },
    
    getDescription: function(href)
    {
        var response = Ametys.data.ServerComm.send({
            plugin: 'cms',
            url: 'resource/info',
            parameters: {id: href}, 
            priority: Ametys.data.ServerComm.PRIORITY_SYNCHRONOUS
        });
        
        if (response == null || response.getAttribute("code") == "500" || response.getAttribute("code") == "404" || Ext.dom.Query.selectNode('resources > resource', response) == null)
        {
            return "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_ERROR_DESCRIPTION}}";
        }
        
        return "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_DESCRIPTION}}" + Ext.dom.Query.selectNode('contents > content', response).getAttribute("type");
    }
});