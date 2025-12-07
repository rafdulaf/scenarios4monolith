Ext.define('Ametys.scenario.Links', {
    override: 'Ametys.plugins.cms.editor.Links',

    initializeScenarioElementLinks: function(controller)
    {
        this.addLinkHandler('scenario-element', Ext.create('Ametys.scenario.Links.ScenarioElementLinkHandler', {}));
    },
    
    insertScenarioElementLink: function(controller)
    {
        var editor = controller.getCurrentField().getEditor();
        this._insertScenarioElementLink(editor, controller.base);
    },
    
    _insertScenarioElementLink: function(editor, base)
    {
        var currentId = null;
        var node = editor.dom.getParent(editor.selection.getNode(), 'a');
        if (node != null && (node.getAttribute('data-ametys-type') == 'scenario-element'))
        {
            currentId = node.getAttribute('data-ametys-href');
        }

        this._doInsertScenarioElementLink(currentId, base);
    },    

    _doInsertScenarioElementLink: function(currentId, base)
    {
        Ametys.scenario.ChooseScenarioElement.open({
            title: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_LABEL}}",
            value: currentId,
            callback: Ext.bind(this._insertScenarioElementLinkCb, this),
            base: base
        });
    },
    
    _insertScenarioElementLinkCb: function(contentId, text, imageUrl, imageNum, imageSize, contentType, color, float)
    {
        // FIXME "tinyMCE.activeEditor" a better method is to use the field.getEditor()
        tinyMCE.activeEditor.execCommand('mceBeginUndoLevel');

        var node = tinyMCE.activeEditor.dom.getParent(tinyMCE.activeEditor.selection.getNode(), 'a');
        if (node != null)
        {
            node.parentNode.removeChild(node);
        }
        
        tinyMCE.activeEditor.selection.collapse();
        
        tinyMCE.activeEditor.execCommand('mceInsertContent', false, "<a href='#'>" + (imageUrl ? "<img marker=\"marker\" data-contenttype=\"" + contentType+ "\" data-color=\"" + color + "\" src=\"" + imageUrl.replace("LANG", Ametys.cms.language.LanguageDAO.getCurrentLanguage()) + "\"/>" : "") + (imageUrl && text ? "&#160;" : "") + (text || '') + "{$caret}</a>");

        node = tinyMCE.activeEditor.dom.getParent(tinyMCE.activeEditor.selection.getNode(), 'a');
        tinyMCE.activeEditor.selection.select(node);

        tinyMCE.activeEditor.execCommand('mceInsertLink', false, {
            "data-ametys-type": "scenario-element", 
            "data-ametys-href": contentType + "#" + contentId + "#" + color,
            "data-imagesize": imageUrl ? imageSize : "",
            "data-image": imageUrl ? imageNum : "",
            "data-text": !!text,  
            "data-contenttype": contentType,
            "class": "invisible float-" + float,
            "href": "#", 
            "contenteditable": "false",
            "_mce_ribbon_select" : "1" 
        });

        tinyMCE.activeEditor.execCommand('mceEndUndoLevel');

                // Delayed to wait for the dialog box to hide.
        window.setTimeout(function() {tinyMCE.activeEditor.focus();}, 100);
    }
});