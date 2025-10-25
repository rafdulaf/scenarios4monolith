Ext.define('Ametys.scenario.ChooseScenarioElement', {
    singleton: true,
    
    open: function(config)
    {
        this._cbFn = config.callback || Ext.emptyFn;
        this._currentId = config.value || null;
        this._delayedInitialize(config.icon, config.iconCls, config.title, config.helpmessage);
        
        this._box.show();
    },
    
    _delayedInitialize: function(icon, iconCls, title, helpmessage)
    {
        this._box = Ext.create('Ametys.window.DialogBox', {
            title: title,
            icon: icon,
            iconCls: icon ? null : (iconCls || 'ametysicon-world-earth-communicating'),
            
            width: 410,
            height: 500,
            scrollable: false,
            
            bodyStyle: {
                padding: 0
            },
            cls: 'ametys-dialogbox choose-scenario-element',
            
            layout: {
                type: 'vbox',
                align : 'stretch',
                pack  : 'start'
            },
                
            items: [{
                    xtype: 'component',
                    cls: 'a-text',
                    html: helpmessage || "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_HINT}}"
                }, 
//                this._tree
            ],
            
            closeAction: 'destroy',
            
            referenceHolder: true,
            defaultButton: 'validate',
            
            buttons : [{
                reference: 'validate',
                text: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_OK}}",
                disabled: true,
                handler: Ext.bind(this._ok, this)
            }, {
                text: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_CANCEL}}",
                handler: Ext.bind(function() {this._box.close();}, this) // hide
            }],
            
            listeners: {
                close: {fn: this._close, scope: this}//for callback on close
            }
        });
    },
    
    _ok: function()
    {
        // TODO
        
        if (this._cbFn(id, text, size, viewHref, downloadHref, null) !== false)
        {
            this._box.hide();
        }
    },
    
    _close: function()
    {
        // TODO ?
    },
    
    _onSelectionChange: function(sm, nodes)
    {
        var node = nodes[0],
            okBtn = this._box.getDockedItems('toolbar[dock="bottom"] button')[0];
        
        if (node == null || node.isRoot())
        {
            okBtn.setDisabled(true);
        }
        else
        {
            var type = node.get('type');
            okBtn.setDisabled(type != Ametys.explorer.tree.ExplorerTree.RESOURCE_TYPE);
        }
    }
});