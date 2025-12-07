<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns="http://docbook.org/ns/docbook" 
    xmlns:html="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:math="http://exslt.org/math"
	xmlns:dyn="http://exslt.org/dynamic"
	xmlns:xalan="http://xml.apache.org/xalan"
    xmlns:editor="org.ametys.cms.transformation.xslt.InlineEditorHelper"
    xmlns:xlink="http://www.w3.org/1999/xlink"
	exclude-result-prefixes="math dyn xalan editor">
	
	<xsl:output method="xml" indent="yes"/>
	
    <xsl:template match="a[@data-ametys-type='scenario-element']">
        <link xrefstyle="{@class}" xlink:type="{@data-ametys-type}" xlink:href="{@data-ametys-href}" xlink:text="{@data-text}" xlink:imagesize="{@data-imagesize}" xlink:image="{@data-image}" xlink:contenttype="{@data-contenttype}"/>
    </xsl:template>
</xsl:stylesheet>
