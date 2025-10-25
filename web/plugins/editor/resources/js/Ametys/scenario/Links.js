Ext.define('Ametys.scenario.Links', {
    override: 'Ametys.plugins.cms.editor.Links',

    initializeScenarioElementLinks: function(controller)
    {
        this.addLinkHandler('scenario-element', Ext.create('Ametys.scenario.Links.ScenarioElementLinkHandler', {}));
    },
    
    insertScenarioElementLink: function(controller)
    {
        var editor = controller.getCurrentField().getEditor();
        this._insertScenarioElementLink(editor);
    },
    
    _insertScenarioElementLink: function(editor)
    {
        var currentId = null;
        var node = editor.dom.getParent(editor.selection.getNode(), 'a');
        if (node != null && (node.getAttribute('data-ametys-type') == 'scenario-element'))
        {
            currentId = node.getAttribute('data-ametys-href');
        }

        this._doInsertScenarioElementLink(currentId);
    },    

    _doInsertScenarioElementLink: function(currentId)
    {
        Ametys.scenario.ChooseScenarioElement.open({
            title: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_LABEL}}",
            value: currentId,
            callback: Ext.bind(this._insertScenarioElementLinkCb, this)
        });
    },
    
    _insertScenarioElementLinkCb: function(id, filename, filesize, viewHref, downloadHref, actionResult, type)
    {
        type = type || 'scenario-element';
        
        if (id)
        {
            // FIXME "tinyMCE.activeEditor" a better method is to use the field.getEditor()
            tinyMCE.activeEditor.execCommand('mceBeginUndoLevel');

            var node = tinyMCE.activeEditor.dom.getParent(tinyMCE.activeEditor.selection.getNode(), 'a');
            if (node == null && tinyMCE.activeEditor.selection.isCollapsed())
            {
                var text = "{{i18n PLUGINS_WORKSPACES_EDITOR_LINK_DOWNLOAD}} «" + filename + "» (" + Ext.util.Format.fileSize(filesize) + ")"; 
                tinyMCE.activeEditor.execCommand('mceInsertContent', false, "<a href='#'>" + text + "{$caret}</a>");

                node = tinyMCE.activeEditor.dom.getParent(tinyMCE.activeEditor.selection.getNode(), 'a');
                tinyMCE.activeEditor.selection.select(node);
            }

            tinyMCE.activeEditor.execCommand('mceInsertLink', false, { "data-ametys-href": id, href: downloadHref, "class": "download", "data-ametys-type": type, "_mce_ribbon_select" : "1" });
            tinyMCE.activeEditor.selection.collapse();

            tinyMCE.activeEditor.execCommand('mceEndUndoLevel');
        }

        // Delayed to wait for the dialog box to hide.
        window.setTimeout(function() {tinyMCE.activeEditor.focus();}, 100);
    }
});