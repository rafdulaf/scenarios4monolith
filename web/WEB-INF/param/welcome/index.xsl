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
    <!--
        DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
    -->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
                xmlns:ametys="org.ametys.web.transformation.xslt.AmetysXSLTHelper"
                xmlns:resolver="org.ametys.cms.transformation.xslt.ResolveURIComponent"
                exclude-result-prefixes="resolver ametys i18n">

    <xsl:variable name="uri-prefix" select="ametys:uriPrefix()"/>
    <xsl:variable name="resource-uri-prefix"><xsl:value-of select="$uri-prefix"/>/param_resources/welcome</xsl:variable>
    
    <xsl:variable name="siteUrl" select="ametys:siteParameter('url')"/>
    <xsl:variable name="skin" select="ametys:skin()"/>
    
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <link type="text/css" href="{$resource-uri-prefix}/css/layout.css" rel="stylesheet" media="screen" />
                <link type="text/css" href="{$resource-uri-prefix}/css/print.css" rel="stylesheet" media="print" />
                <title>Help</title>
            </head>
            <body>
                <div class="frame">
                    <h2>Demo version</h2>
                    <p>This version is for demo and trial purposes only.</p> 
                    <ul>
                        <li>It runs on a local desktop and should not be used for production purposes.</li> 
                        <li>You should not create contents and pages that you would like to keep.</li>
                        <li>We recommend to use <strong>Firefox</strong>, <strong>Chrome</strong> or <strong>Edge</strong>.</li>
                    </ul>
                    <h2>Community</h2>
                    <p>Ametys is Open Source, you can see the documentation and contribute here:</p>
                    <ul>
                        <li><a target="_blank" href="https://www.ametys.org/forum">Ametys Forum</a></li>
                        <li><a target="_blank" href="https://docs.ametys.org/">Ametys Documentations</a></li>
                        <li><a target="_blank" href="https://issues.ametys.org/browse/CMS">Issues and enhancement tool</a></li>
                    </ul>
                    <p>Visit also the Ametys website <a target="_blank" href="https://www.ametys.org">www.ametys.org</a>.</p>
                </div>
                
                <div class="print"><a href="javascript:window.print()" title="Imprimer"><img src="{$resource-uri-prefix}/img/print.png" alt="Imprimer"/></a></div>
                <h1>Welcome to Ametys</h1>
                <p>
                    You are in the contributor workspace of the website <a target="_blank" href="{$siteUrl}"><b><xsl:value-of select="ametys:siteParameter('title')"/></b></a> using the <b><xsl:value-of select="$skin"/></b> skin.
                    <br />
                    <br />
                    Use the <b><i>Sitemap</i></b> tool on the left to create or alter pages.
                    <br />
                    Click twice on a page to open it. 
                </p>
                
                <h1>Need help?</h1>
                <p>Use the "Search a feature" search bar of the ribbon.<br/>
                Use the online help by pressing the <strong>F1 key </strong>on hover of a button or tool, or by clicking on the link <strong>Know more</strong> of tooltips
                </p>
                
                <h1>Templates</h1>
                <h2>Home</h2>
                <img src="{$uri-prefix}/skins/{$skin}/templates/index/resources/thumbnail.png" alt="Page d'accueil" class="floatleft" />
                <p>
                    The <i>home</i> template is only for the home page, named "index". <br/>
                    This template is composed of several areas.
                    Some areas can be directly updated, others are automatically filled by tags :
                    <ul>
                        <li><strong>Header:</strong> the header image is fixed. It can not be modified.</li>
                        <li><strong>Sections and sub-sections:</strong> the section menu is automatically composed of pages tagged as "main section".
                            Sub-sections appear if sub-pages are tagged as "sub section".
                        </li>
                        <li><strong>Footer:</strong> footer links are shortcuts to pages of the sitemap. To appear, they must be tagged as "link footer".
                        </li>
                    </ul>
                </p>
                <br style="clear:both"/>
                    <h2>Page</h2>
                    <img src="{$uri-prefix}/skins/{$skin}/templates/page/resources/thumbnail.png" alt="interieur" class="floatleft" />
                    <p>The <i>page</i> template is used for all other pages.<br/>
                        This template is composed of several areas.
                        Some areas can be directly updated, others are automatically filled by tags :
                    <ul>
                        <li><strong>Header:</strong> the header image is fixed. It can not be modified.</li>
                        <li><strong>Sections and sub-sections:</strong> the section menu is automatically composed of pages tagged as "main section".
                            Sub-sections appear if sub-pages are tagged as "sub section".
                        </li>
                        <li><strong>Navigation:</strong> on left, navigation inside the section is automatically built.</li>
                        <li><strong>Footer:</strong> footer links are shortcuts to pages of the sitemap. To appear, they must be tagged as "link footer".
                        </li>
                    </ul>
                    </p>
                    <br style="clear:both"/>
                    <h1>Content types</h1>
                    
                    <xsl:choose>
                        <xsl:when test="$skin = 'demo'">
                            <h2>Articles</h2>
                            <p>You should use it for most pages: Overview, Contact, References ...</p>
                            <h2>News</h2>
                            <p>Use news content type for events: new products, news of any kind, events ..</p>
                            <h2>Photo gallery</h2>
                            <p>The content "Photo Gallery" is used to present a photo gallery with slideshow</p>
                            <h2>Multimedia gallery</h2>
                            <p>The content "multimedia gallery" is used to display a playlist of videos provided in flash format (. Flv)</p>
                            <h2>FAQ</h2>
                            <p>The content "FAQ" is used to present a "Frequently asked questions" (list of questions/answers)</p>
                        </xsl:when>
                        <xsl:when test="$skin = 'blog'">
                            <h2>Posts</h2>
                            <p>The content "Post" is used to present a post or commentable article of the blog. Click on <b><i>New post</i></b> to create a new post.</p>
                            <h2>Articles</h2>
                            <p>You should use it for content of others pages: Contact, Legal mentions ...</p>
                            <h2>About</h2>
                            <p>The content "About" is used to present the author(s) of the blog.</p>
                        </xsl:when>
                    </xsl:choose>
                    <div class="clear-L"></div>
            </body>
        </html>
    </xsl:template>
    
</xsl:stylesheet>                        
