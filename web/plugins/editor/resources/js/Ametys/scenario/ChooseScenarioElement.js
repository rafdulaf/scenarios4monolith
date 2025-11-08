Ext.define('Ametys.scenario.ChooseScenarioElement', {
    singleton: true,
    
    open: function(config)
    {
        this._cbFn = config.callback || Ext.emptyFn;
        this._currentId = config.value || null;
        this._delayedInitialize(config.icon, config.iconCls, config.title, config.helpmessage);
        this._base = config.base;
        
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
                'change': this._onContentChange,
                scope: this
            }
        });
        
        this._insertAsImage1 = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE1}}CHOISIR TAILLE + COULEUR TOUR TUILE + preview carte",
            disabled: true,
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage1Cmp = Ext.create('Ext.Component', {});
        
        this._insertAsImage2 = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE2}}",
            disabled: true,
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });

        this._insertAsImage2Cmp = Ext.create('Ext.Component', {});

        this._insertAsText = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_TEXT}}",
            disabled: true,
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        
        this._insertAsTextCmp = Ext.create('Ext.Component', { cls: 'preview-text'});

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
                { xtype: 'component', html: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_HINT}}" },
                this._insertAsText,
                this._insertAsTextCmp,
                this._insertAsImage1,
                this._insertAsImage1Cmp,
                this._insertAsImage2,
                this._insertAsImage2Cmp,
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
    
    _onContentChange: function() 
    {
        let okButton = Ext.getCmp('choose-scenario-element-ok-btn');
        
        if (this._content.getValue() == null)
        {
            this._insertAsImage1.disable();
            this._insertAsImage1Cmp.setHtml('');
            this._insertAsImage2.disable();
            this._insertAsImage2Cmp.setHtml('');
            this._insertAsText.disable();
            this._insertAsTextCmp.setHtml('');
            okButton.disable();
        } 
        else
        {
            Ametys.data.ServerComm.send({
                url: '_content.xml',
                parameters:  {contentId: this._content.getValue(), isEdition: "false", viewName: "main"}, 
                priority: Ametys.data.ServerComm.PRIORITY_MAJOR, 
                callback: {
                    handler: function(response) {
                        if (Ametys.data.ServerComm.handleBadResponse("{{i18n plugin.cms:PLUGINS_CMS_TOOL_CONTENT_FORMDEFINITION_ERROR}} '" + this._contentId + "'", response, Ext.getClassName(this)))
                        {
                            return;
                        }
                        
                        let image1 = Ext.dom.Query.selectValue("> content > metadata > image", response);
                        let image2 = Ext.dom.Query.selectValue("> content > metadata > image2", response);
                        let title = Ext.dom.Query.selectValue("> content > metadata > title", response);
                        
                        let contentType = Ext.dom.Query.selectValue("> content > contentTypes > contentType", response);
                        let color = Ext.dom.Query.selectValue("> content > metadata > color", response);
                        
                        this._insertAsImage1Cmp.setHtml(image1 ? '<img class="preview-' + contentType + '" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image1 + '"/>' : '');
                        this._insertAsImage1.setDisabled(image1 == null);
                        
                        this._insertAsImage2Cmp.setHtml(image2 ? '<img class="preview-' + contentType + '" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image2 + '"/>' : '');
                        this._insertAsImage2.setDisabled(image2 == null);

                        this._insertAsTextCmp.setHtml(title ? title : '');
                        this._insertAsText.setDisabled(title == null);
                        
                        this._onInsertChange();
                    },
                    scope: this
                },
                cancelCode: "Ametys.scenario.ChooseScenarioElement"
            });
        }
    },
    
    _onInsertChange: function()
    {
        let okButton = Ext.getCmp('choose-scenario-element-ok-btn');
        
        okButton.setDisabled(
            (this._insertAsImage1.isDisabled() || this._insertAsImage1.getValue() === false)
            && (this._insertAsImage2.isDisabled() || this._insertAsImage2.getValue() === false)
            && (this._insertAsText.isDisabled() || this._insertAsText.getValue() === false)
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
    }
});