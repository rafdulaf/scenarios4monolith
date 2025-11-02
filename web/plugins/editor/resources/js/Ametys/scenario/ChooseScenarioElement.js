Ext.define('Ametys.scenario.ChooseScenarioElement', {
    singleton: true,
    
    open: function(config)
    {
        this._cbFn = config.callback || Ext.emptyFn;
        this._currentId = config.value || null;
        this._delayedInitialize(config.icon, config.iconCls, config.title, config.helpmessage);
        
        this._box.show();
    },
    
    _contentTypeToLabel: function(contentType)
    {
        let label = Ametys.cms.content.ContentTypeDAO.getContentType(contentType[0]).get('label');
        return label.substring(label.indexOf("] ") + 2);
    },
    
    _delayedInitialize: function(icon, iconCls, title, helpmessage)
    {
        this._content = Ext.create('Ametys.cms.form.widget.SelectReferenceTableContent', {
            contentType: 'conan-abstract-scenario-element',
            
            getLabelTpl: function ()
            {
                var labelTpl = [];
                if (this.displayTypeIcon != false && this.displayTypeIcon != 'false')
                {
                    labelTpl.push('<tpl if="values.iconGlyph != \'\'"><span class="x-tagfield-glyph {iconGlyph} {iconDecorator}"></span></tpl>');
                    labelTpl.push('<tpl if="values.iconGlyph == \'\'"><img width="16" height="16" src="' + Ametys.CONTEXT_PATH + '{smallIcon}"/></tpl>');
                }
                
                if (this.openOnClick == true || this.openOnClick == 'true')
                {
                    labelTpl.push('<tpl if="values.clickable == true"><span class="clickable">{[values.title]}</span></tpl>');
                    labelTpl.push('<tpl if="values.clickable != true">{[values.title]}</tpl>');
                }
                else
                {
                    labelTpl.push('{[values.title]} ({[Ametys.scenario.ChooseScenarioElement._contentTypeToLabel(values.contentTypes)]})');
                }
             
                return labelTpl;
            },
            
            listConfig: {
                getInnerTpl: function() {
                       var labelTpl = [];
                       if (this.displayTypeIcon != false && this.displayTypeIcon != 'false')
                       {
                           labelTpl.push('<tpl if="values.iconGlyph != \'\'"><span class="x-tagfield-glyph {iconGlyph} {iconDecorator}"></span></tpl>');
                           labelTpl.push('<tpl if="values.iconGlyph == \'\'"><img width="16" height="16" src="' + Ametys.CONTEXT_PATH + '{smallIcon}"/></tpl>');
                       }
                       
                       if (this.openOnClick == true || this.openOnClick == 'true')
                       {
                           labelTpl.push('<tpl if="values.clickable == true"><span class="clickable">{[values.title]}</span></tpl>');
                           labelTpl.push('<tpl if="values.clickable != true">{[values.title]}</tpl>');
                       }
                       else
                       {
                           labelTpl.push(' {[values.title]} ({[Ametys.scenario.ChooseScenarioElement._contentTypeToLabel(values.contentTypes)]})');
                       }

                       return labelTpl.join('');
                },
                renderTpl: Ametys.cms.form.widget.SelectContent.prototype.listConfig.renderTpl
            }
        });
        
        
        this._box = Ext.create('Ametys.window.DialogBox', {
            title: title,
            icon: icon,
            iconCls: icon ? null : (iconCls || 'ametysicon-abecedary4'),
            
            width: 610,
            height: 300,
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
                this._content
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
            this._box.hide(); // hide to avoir call to onclose in this case... null
        }
    },
    
    _close: function()
    {
        this._cbFn(null);
        this._content = null;
        this._box = null;
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