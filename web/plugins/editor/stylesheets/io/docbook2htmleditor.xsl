<?xml version="1.0" encoding="UTF-8"?>
<!--
   Copyright 2010 Anyware Services

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   -->
<xsl:stylesheet version="1.0" 
                xmlns:docbook="http://docbook.org/ns/docbook" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:resolver="org.ametys.cms.transformation.xslt.ResolveURIComponent"
                xmlns:stringutils="org.apache.commons.lang3.StringUtils"
                xmlns:helper="fr.rafdulaf.scenarios4monolith.editor.XSLTHelper"
                exclude-result-prefixes="docbook xlink resolver html">
	
	<xsl:param name="contextPath"/>
    <xsl:param name="workspaceName"/>
    <xsl:param name="workspaceURI"/>
	
    <xsl:template match="docbook:link[@xlink:type='scenario-element']">
        <xsl:variable name="info" select="helper:getScenarioElementInfo(@xlink:href)"/>
        <xsl:variable name="imageNumber" select="@xlink:image"/>
    
        <a class="{@xrefstyle}" contenteditable="false" href="#" data-ametys-href="{@xlink:href}" data-ametys-type="{@xlink:type}" data-text="{@xlink:text}" data-image="{@xlink:image}" data-imagesize="{@xlink:imagesize}" data-contenttype="{@xlink:contenttype}">
            <xsl:if test="@xlink:image != ''"><img marker="marker" data-contenttype="{@xlink:contenttype}" data-color="{stringutils:substringAfterLast(@xlink:href, '#')}" src="{$info/*[local-name()=concat('image', $imageNumber)]}"/></xsl:if>
            <xsl:if test="@xlink:text = 'true'">&#160;<xsl:value-of select="$info/title"/></xsl:if>
        </a>
    </xsl:template>
    
</xsl:stylesheet>
