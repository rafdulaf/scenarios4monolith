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
        
        this._insertAsText = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_TEXT}} TODO preview carte",
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsTextCmp = Ext.create('Ext.Component', { cls: 'preview-text'});

        this._insertAsImageNo = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_NO}}",
            name: 'image',
            inputValue: 'no',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImageNoCmp = Ext.create('Ext.Component', { });
        
        this._insertAsImage1Big = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_1_BIG}}",
            name: 'image',
            inputValue: '1-big',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage1BigCmp = Ext.create('Ext.Component', {});

        this._insertAsImage1Medium = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_1_MEDIUM}}",
            name: 'image',
            inputValue: '1-medium',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage1MediumCmp = Ext.create('Ext.Component', {});

        this._insertAsImage1Small = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_1_SMALL}}",
            name: 'image',
            inputValue: '1-small',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage1SmallCmp = Ext.create('Ext.Component', {});

        this._insertAsImage2Big = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_2_BIG}}",
            name: 'image',
            inputValue: '2-big',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage2BigCmp = Ext.create('Ext.Component', {});

        this._insertAsImage2Medium = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_2_MEDIUM}}",
            name: 'image',
            inputValue: '1-medium',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage2MediumCmp = Ext.create('Ext.Component', {});

        this._insertAsImage2Small = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_2_SMALL}}",
            name: 'image',
            inputValue: '2-small',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage2SmallCmp = Ext.create('Ext.Component', {});
        
        this._hint = Ext.create('Ext.Component', { 
            html: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_HINT}}" 
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
                this._hint,
                this._insertAsText,
                this._insertAsTextCmp,
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '100%',
                    items: [
                        { xtype: 'container', flex: 1, items: [ this._insertAsImageNo, this._insertAsImageNoCmp ] },
                        { xtype: 'container', flex: 1, items: [ this._insertAsImage1Big, this._insertAsImage1BigCmp ] },
                        { xtype: 'container', flex: 1, items: [ this._insertAsImage1Medium, this._insertAsImage1MediumCmp ] },
                        { xtype: 'container', flex: 1, items: [ this._insertAsImage1Small, this._insertAsImage1SmallCmp ] }
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '100%',
                    items: [
                        { xtype: 'component', flex: 1, items: [] },
                        { xtype: 'container', flex: 1, items: [ this._insertAsImage2Big, this._insertAsImage2BigCmp ] },
                        { xtype: 'container', flex: 1, items: [ this._insertAsImage2Medium, this._insertAsImage2MediumCmp ] },
                        { xtype: 'container', flex: 1, items: [ this._insertAsImage2Small, this._insertAsImage2SmallCmp ] }
                    ],
                }
            ],
            
            closeAction: 'destroy',
            
            referenceHolder: true,
            defaultButton: 'validate',
            
            buttons : [{
                id: 'choose-scenario-element-ok-btn',
                reference: 'validate',
                text: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_OK}}",
                handler: Ext.bind(this._ok, this)
            }, {
                text: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_CANCEL}}",
                handler: Ext.bind(function() {this._box.close();}, this) // hide
            }],
            
            listeners: {
                close: {fn: this._close, scope: this}//for callback on close
            }
        });
        
        this._onContentChange();
    },

    _adaptText: function(title) 
    {
        if (!title)
        {
            this._insertAsText.disable();
            this._insertAsText.hide();
            this._insertAsTextCmp.setHtml('');
        }
        else
        {
            let t = title.indexOf(' (');
            if (t != -1)
            {
                title = title.substring(0, t);
            }
            
            this._insertAsText.enable();
            this._insertAsText.show();
            this._insertAsTextCmp.setHtml('<strong>' + title + '</strong>');
        }
    },

    _adaptImage: function(image1, image2, contentType, color) 
    {
        if (!image1)
        {
            this._insertAsImageNo.disable();
            this._insertAsImageNo.hide();
            this._insertAsImageNoCmp.setHtml('');
            this._insertAsImageNo.setValue(true);

            this._insertAsImage1Big.disable();
            this._insertAsImage1Big.hide();
            this._insertAsImage1BigCmp.setHtml('');
    
            this._insertAsImage1Medium.disable();
            this._insertAsImage1Medium.hide();
            this._insertAsImage1MediumCmp.setHtml('');
    
            this._insertAsImage1Small.disable();
            this._insertAsImage1Small.hide();
            this._insertAsImage1SmallCmp.setHtml('');
            
            this._insertAsImage2Big.disable();
            this._insertAsImage2Big.hide();
            this._insertAsImage2BigCmp.setHtml('');
    
            this._insertAsImage2Medium.disable();
            this._insertAsImage2Medium.hide();
            this._insertAsImage2MediumCmp.setHtml('');
    
            this._insertAsImage2Small.disable();
            this._insertAsImage2Small.hide();
            this._insertAsImage2SmallCmp.setHtml('');
        }
        else
        {
            this._insertAsImageNo.enable();
            this._insertAsImageNo.show();
            this._insertAsImageNoCmp.setHtml('');

            this._insertAsImage1Big.enable();
            this._insertAsImage1Big.show();
            this._insertAsImage1BigCmp.setHtml('<img class="preview-' + contentType + ' preview-big" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image1 + '"/>');

            this._insertAsImage1Medium.enable();
            this._insertAsImage1Medium.show();
            this._insertAsImage1MediumCmp.setHtml('<img class="preview-' + contentType + ' preview-medium" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image1 + '"/>');

            this._insertAsImage1Small.enable();
            this._insertAsImage1Small.show();
            this._insertAsImage1SmallCmp.setHtml('<img class="preview-' + contentType + ' preview-small" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image1 + '"/>');
            
            if (image2)
            {
                this._insertAsImage2Big.enable();
                this._insertAsImage2Big.show();
                this._insertAsImage2BigCmp.setHtml('<img class="preview-' + contentType + ' preview-big" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image2 + '"/>');

                this._insertAsImage2Medium.enable();
                this._insertAsImage2Medium.show();
                this._insertAsImage2MediumCmp.setHtml('<img class="preview-' + contentType + ' preview-medium" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image2 + '"/>');

                this._insertAsImage2Small.enable();
                this._insertAsImage2Small.show();
                this._insertAsImage2SmallCmp.setHtml('<img class="preview-' + contentType + ' preview-small" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image2 + '"/>');
            }
            else
            {
                if (this._insertAsImage2Big.getValue() || this._insertAsImage2Medium.getValue() || this._insertAsImage2Small.getValue())
                {
                    this._insertAsImageNo.setValue(true);
                }

                this._insertAsImage2Big.disable();
                this._insertAsImage2Big.hide();
                this._insertAsImage2BigCmp.setHtml('');

                this._insertAsImage2Medium.disable();
                this._insertAsImage2Medium.hide();
                this._insertAsImage2MediumCmp.setHtml('');

                this._insertAsImage2Small.disable();
                this._insertAsImage2Small.hide();
                this._insertAsImage2SmallCmp.setHtml('');
            }
        }
    },
        
    _onContentChange: function() 
    {
        let okButton = Ext.getCmp('choose-scenario-element-ok-btn');
        
        if (this._content.getValue() == null)
        {
            this._hint.hide();
            this._adaptText();
            this._adaptImage();
            okButton.disable();
        } 
        else
        {
            this._hint.show();
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
                        this._adaptText(title);
                        
                        let contentType = Ext.dom.Query.selectValue("> content > contentTypes > contentType", response);
                        let color = Ext.dom.Query.selectValue("> content > metadata > color", response);
                        this._adaptImage(image1, image2, contentType, color);

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
            (this._insertAsText.isDisabled() || this._insertAsText.getValue() === false)
            && (this._insertAsImageNo.isDisabled() || this._insertAsImageNo.getValue())
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