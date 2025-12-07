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
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_TEXT}}",
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsTextCmp = Ext.create('Ext.Component', { cls: 'preview-text' });

        this._insertAsImageNo = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_NO}}",
            name: 'image',
            inputValue: 'no',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImageNoCmp = Ext.create('Ext.Component', {});
        
        this._insertAsImage1Big = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_1_BIG}}",
            name: 'image',
            inputValue: '1-big',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage1BigCmp = Ext.create('Ext.Component', { 
            listeners: {
                "render": function(t) {
                    t.getEl().dom.setAttribute("data-image", "1");
                    t.getEl().dom.setAttribute("data-imagesize", "big");
                },
                scope: this
            }
        });

        this._insertAsImage1Medium = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_1_MEDIUM}}",
            name: 'image',
            inputValue: '1-medium',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage1MediumCmp = Ext.create('Ext.Component', { 
            listeners: {
                "render": function(t) {
                    t.getEl().dom.setAttribute("data-image", "1");
                    t.getEl().dom.setAttribute("data-imagesize", "medium");
                },
                scope: this
            }
        });

        this._insertAsImage1Small = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_1_SMALL}}",
            name: 'image',
            inputValue: '1-small',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage1SmallCmp = Ext.create('Ext.Component', { 
            listeners: {
                "render": function(t) {
                    t.getEl().dom.setAttribute("data-image", "1");
                    t.getEl().dom.setAttribute("data-imagesize", "small");
                },
                scope: this
            }
        });
        
        this._insertAsImage2Big = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_2_BIG}}",
            name: 'image',
            inputValue: '2-big',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage2BigCmp = Ext.create('Ext.Component', { 
            listeners: {
                "render": function(t) {
                    t.getEl().dom.setAttribute("data-image", "2");
                    t.getEl().dom.setAttribute("data-imagesize", "big");
                },
                scope: this
            }
        });

        this._insertAsImage2Medium = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_2_MEDIUM}}",
            name: 'image',
            inputValue: '1-medium',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage2MediumCmp = Ext.create('Ext.Component', { 
            listeners: {
                "render": function(t) {
                    t.getEl().dom.setAttribute("data-image", "2");
                    t.getEl().dom.setAttribute("data-imagesize", "medium");
                },
                scope: this
            }
        });
        
        this._insertAsImage2Small = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_AS_IMAGE_2_SMALL}}",
            name: 'image',
            inputValue: '2-small',
            listeners: {
                'change': this._onInsertChange,
                scope: this
            }
        });
        this._insertAsImage2SmallCmp = Ext.create('Ext.Component', { 
            listeners: {
                "render": function(t) {
                    t.getEl().dom.setAttribute("data-image", "2");
                    t.getEl().dom.setAttribute("data-imagesize", "small");
                },
                scope: this
            }
        });
        
        this._hint = Ext.create('Ext.Component', { 
            html: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_INSERT_HINT}}" 
        });
        
        this._floatLeft = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_FLOAT_LEFT}}", 
            iconCls: "ametysicon-design26", 
            name: 'float'
        });
        this._floatNo = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_FLOAT_NO}}", 
            iconCls: "ametysicon-black391", 
            name: 'float',
            value: true        
        });
        this._floatRight = Ext.create('Ext.form.field.Radio', {
            boxLabel: "{{i18n EDITOR_LINKS_SCENARIO_ELEMENT_FLOAT_RIGHT}}", 
            iconCls: "ametysicon-floatright", 
            name: 'float'
        });
        this._floatButtons = Ext.create('Ext.container.Container', );

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
                        { xtype: 'container', flex: 2, items: [ this._insertAsImage1Big, this._insertAsImage1BigCmp ] },
                        { xtype: 'container', flex: 1.6, items: [ this._insertAsImage1Medium, this._insertAsImage1MediumCmp ] },
                        { xtype: 'container', flex: 1.2, items: [ this._insertAsImage1Small, this._insertAsImage1SmallCmp ] }
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '100%',
                    items: [
                        { xtype: 'component', flex: 1, items: [] },
                        { xtype: 'container', flex: 2, items: [ this._insertAsImage2Big, this._insertAsImage2BigCmp ] },
                        { xtype: 'container', flex: 1.6, items: [ this._insertAsImage2Medium, this._insertAsImage2MediumCmp ] },
                        { xtype: 'container', flex: 1.2, items: [ this._insertAsImage2Small, this._insertAsImage2SmallCmp ] }
                    ],
                },
                this._floatLeft,
                this._floatNo,
                this._floatRight
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
            this._title = '';
            
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
            
            this._title = title;

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
            
            this._floatLeft.hide();
            this._floatNo.hide();
            this._floatRight.hide();
        }
        else
        {
            image1 = image1.replace("LANG", Ametys.cms.language.LanguageDAO.getCurrentLanguage());
            
            this._insertAsImageNo.enable();
            this._insertAsImageNo.show();
            this._insertAsImageNoCmp.setHtml('');

            this._insertAsImage1Big.enable();
            this._insertAsImage1Big.show();
            this._insertAsImage1BigCmp.setHtml('<img data-contenttype="' + contentType + '" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image1 + '"/>');

            this._insertAsImage1Medium.enable();
            this._insertAsImage1Medium.show();
            this._insertAsImage1MediumCmp.setHtml('<img data-contenttype="' + contentType + '" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image1 + '"/>');

            this._insertAsImage1Small.enable();
            this._insertAsImage1Small.show();
            this._insertAsImage1SmallCmp.setHtml('<img data-contenttype="' + contentType + '" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image1 + '"/>');
            
            if (image2)
            {
                image2 = image2.replace("LANG", Ametys.cms.language.LanguageDAO.getCurrentLanguage());

                this._insertAsImage2Big.enable();
                this._insertAsImage2Big.show();
                this._insertAsImage2BigCmp.setHtml('<img data-contenttype="' + contentType + '" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image2 + '"/>');

                this._insertAsImage2Medium.enable();
                this._insertAsImage2Medium.show();
                this._insertAsImage2MediumCmp.setHtml('<img data-contenttype="' + contentType + '" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image2 + '"/>');

                this._insertAsImage2Small.enable();
                this._insertAsImage2Small.show();
                this._insertAsImage2SmallCmp.setHtml('<img data-contenttype="' + contentType + '" ' + (color ? 'data-color="' + color + '"' : '') + '  src="' + this._base + "/" + image2 + '"/>');
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
            

            this._floatLeft.show();
            this._floatNo.show();
            this._floatRight.show();
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
                        if (Ametys.data.ServerComm.handleBadResponse("{{i18n plugin.cms:PLUGINS_CMS_TOOL_CONTENT_FORMDEFINITION_ERROR}} '" + this._content.getValue() + "'", response, Ext.getClassName(this)))
                        {
                            return;
                        }
                        
                        this._contentId =Ext.dom.Query.selectValue("> content > metadata > identifier", response);
                        
                        this._image1 = Ext.dom.Query.selectValue("> content > metadata > image", response);
                        this._image2 = Ext.dom.Query.selectValue("> content > metadata > image2", response);
                        
                        let title = Ext.dom.Query.selectValue("> content > metadata > title", response);
                        this._adaptText(title);
                        
                        this._contentType = Ext.dom.Query.selectValue("> content > contentTypes > contentType", response);
                        this._color = Ext.dom.Query.selectValue("> content > metadata > color", response);
                        this._adaptImage(this._image1, this._image2, this._contentType, this._color);

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
        let text = !this._insertAsText.isDisabled() && this._insertAsText.getValue() === true ? this._title : null;
        let image = null;
        let imageSize = null;
        let imageNum = null;
        if (!this._insertAsImageNo.isDisabled() && this._insertAsImageNo.getValue() === false)
        {
            if (this._insertAsImage1Big.getValue() === true) { image = this._image1; imageNum = 1; imageSize = 'big'; }
            else if (this._insertAsImage1Medium.getValue() === true) { image = this._image1; imageNum = 1; imageSize = 'medium'; }
            else if (this._insertAsImage1Small.getValue() === true) { image = this._image1; imageNum = 1; imageSize = 'small'; }
            else if (this._insertAsImage2Big.getValue() === true) { image = this._image2; imageNum = 2; imageSize = 'big'; }
            else if (this._insertAsImage2Medium.getValue() === true) { image = this._image2; imageNum = 2; imageSize = 'medium'; }
            else if (this._insertAsImage2Small.getValue() === true) { image = this._image2; imageNum = 2; imageSize = 'small'; }
            else { throw new Error("No image size selected"); }
        }
        
        let float = this._floatLeft.getValue() == true ? "left" : this._floatRight.getValue() == true ? "right" : "none";
        
        if (this._cbFn(this._contentId, text, image != null ? this._base + "/" + image : null, imageNum, imageSize, this._contentType, this._color, float) !== false)
        {
            this._cbFn = function() {};
            this._box.close();
        }        
    },
    
    _close: function()
    {
        this._cbFn(null);
        this._content = null;
        this._box = null;
    }
});