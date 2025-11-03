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
            id: 'choose-scenario-element-content',
            contentType: 'conan-abstract-scenario-element',
            fieldLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_SELECT_CONTENT}}",
            labelAlign: 'top',
            
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
            },
            listeners: {
                'change': this._onChange,
                scope: this
            }
        });
        
        this._insertAs = Ext.create('Ext.form.ComboBox', {
            id: 'choose-scenario-element-insert-as',
            fieldLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS}}",
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            labelAlign: 'top',
            value: 'image-and-text',
            editable: false,
            forceSelection: true,
            store: Ext.create('Ext.data.Store', {
                fields: ['text', 'value'],
                data : [
                    {"text": "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_AND_TEXT}}", "value":"image-and-text"},
                    {"text": "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE}}", "value":"image"},
                    {"text": "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_TEXT}}", "value":"text"}
                ]
            }),
            listeners: {
                'change': this._onChange,
                scope: this
            }
        });

        
        this._box = Ext.create('Ametys.window.DialogBox', {
            title: title,
            icon: icon,
            iconCls: icon ? null : (iconCls || 'ametysicon-abecedary4'),
            
            width: 610,
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
                
            items: [
                this._content,
                this._insertAs
            ],
            
            closeAction: 'destroy',
            
            referenceHolder: true,
            defaultButton: 'validate',
            
            buttons : [{
                id: 'choose-scenario-element-ok-btn',
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
    
    _onChange: function() 
    {
        Ext.getCmp('choose-scenario-element-ok-btn').setDisabled(
            Ext.getCmp('choose-scenario-element-content').getValue() == null
            || Ext.getCmp('choose-scenario-element-insert-as').getValue() == null
        );
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