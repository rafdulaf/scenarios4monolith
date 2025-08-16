<?xml version="1.0" encoding="UTF-8"?>
<!--
   Copyright 2015 Anyware Services

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
                <link type="text/css" href="{$resource-uri-prefix}/css/layout.css" rel="stylesheet" media="screen, print" />
                <link type="text/css" href="{$resource-uri-prefix}/css/print.css" rel="stylesheet" media="print" />
                
                <title>Aide</title>
            </head>
            <body>
                <div class="frame">
                    <h2>Version de démonstration</h2>
                    <p>Cette version est une version d'évaluation et de démonstration.</p> 
                    <ul>
                        <li>Elle est configurée pour être utilisée avec une installation minimale sur un poste de travail local.</li> 
                        <li>Elle n'est pas destinée à être utilisée en production.</li>
                        <li>Il n'est pas conseillé de s'en servir pour effectuer des saisies de données en vue de leur conservation.</li>
                        <li>Les navigateurs compatibles sont <strong>Firefox</strong>, <strong>Chrome</strong> et <strong>Edge</strong>.</li>
                    </ul>
                    <h2>Communauté</h2>
                    <p>Ametys est un logiciel OpenSource, n'hésitez pas à suivre l'avancement du projet et à faire part de vos remarques sur :</p>
                    <ul>
                        <li><a target="_blank" href="https://www.ametys.org/forum">Le forum Ametys</a></li>
                        <li><a target="_blank" href="https://docs.ametys.org/">Documentations Ametys</a></li>
                        <li><a target="_blank" href="https://issues.ametys.org/browse/CMS">L'outil de suivi d'anomalie ou de demandes d'amélioration (en anglais)</a></li>
                    </ul>
                    <p>Retrouvez toutes ces informations ainsi que d'autres sur <a target="_blank" href="https://www.ametys.org">www.ametys.org</a>.</p>
                </div>
                
                <div class="print"><a href="javascript:window.print()" title="Imprimer"><img src="{$resource-uri-prefix}/img/print.png" alt="Imprimer"/></a></div>
                <h1>Bienvenue sur le CMS Ametys</h1>
                <p>
                    Vous êtes dans l'espace de contribution du site <a target="_blank" href="{$siteUrl}"><b><xsl:value-of select="ametys:siteParameter('title')"/></b></a> utilisant la charte <b><xsl:value-of select="$skin"/></b>.
                    <br />
                    <br />
                    Utilisez l'outil
                    <b>
                        <i>Plan du site</i>
                    </b>
                    pour commencer à créer des pages ou les modifier.
                    <br />
                    Double-cliquez sur une page pour l'ouvrir.
                </p>
                
                <h1>Besoin d'aide sur une fonction ?</h1>
                <p>Renseignez les mots clés correspondant à la fonction sur laquelle vous souhaitez de l'aide dans la barre de recherche "Recherche une fonctionnalité" du ruban.<br/>
                Utilisez l'aide en ligne en appuyant sur la <strong>touche F1</strong> au survol d'un bouton ou d'un outil, ou en cliquant sur le lien <strong>En savoir plus</strong> de l'info-bulle.</p>
                
                <h1>Les gabarits</h1>
                    
                    <h2>Accueil</h2>
                    <img src="{$uri-prefix}/skins/{$skin}/templates/index/resources/thumbnail.png" alt="Page d'accueil" class="floatleft" />
                    <p>
                        Le gabarit <i>accueil</i> est réservé à la page d'accueil, nommée "index". <br/>
                        Ce gabarit comprend diverses zones.
                        Certaines zones sont éditables directement, d'autres s'alimentent de manière automatique par le jeu d'étiquettes :
                        <ul>
                            <li><strong>Bandeau:</strong> Le bandeau est constitué d'une image fixe. Il n'est pas possible de la modifier</li>
                            <li><strong>Rubriques et sous-rubriques:</strong> Le bandeau des rubriques se
                                constitue automatiquement, une fois une page du plan du site
                                étiquetée en tant que "Rubrique principale". Les sous-rubriques
                                apparaissent si des sous pages de rubriques sont étiquetées "Sous
                                rubrique"
                            </li>
                            <li><strong>Pied de page:</strong> Les liens de bas de page sont des raccourcis vers une
                                page du plan du site. Pour apparaître, celles-ci doivent avoir
                                l'étiquette "Liens de bas de page".
                            </li>
                        </ul>
                    </p>
                        
                    <br style="clear:both"/>
        
                    <h2>Intérieur</h2>
                    <img src="{$uri-prefix}/skins/{$skin}/templates/page/resources/thumbnail.png" alt="interieur" class="floatleft" />
                    <p>Le gabarit <i>page</i> est utilisé pour toutes les autres pages du sites.
                        <br/> Ce gabarit comprend diverses zones. Certaines zones sont
                        éditables directement, d'autres s'alimentent de manière
                        automatique par le jeu d'étiquettes:
                    <ul>
                        <li><strong>Bandeau:</strong> Le bandeau est constitué d'une image fixe. Il n'est
                            pas possible de la modifier</li>
                        <li><strong>Rubriques et sous-rubriques:</strong> Le bandeau des rubriques se
                            constitue automatiquement, une fois une page du plan du site
                            étiquetée en tant que "Rubrique principale". Les sous-rubriques
                            apparaissent si des sous pages de rubriques sont étiquetées
                            "Sous rubrique"</li>
                        <li><strong>Navigation:</strong> à gauche, la navigation à l'intérieur de la rubrique se se
                            constitue automatiquement.</li>
                        <li><strong>Pied de page:</strong> Les liens de bas de page sont des raccourcis vers une
                            page du plan du site. Pour apparaître, celles-ci doivent avoir
                            l'étiquette "Liens de bas de page".
                        </li>
                    </ul>
                    </p>
                    <br style="clear:both"/>
                    <h1>Les différents types de contenus</h1>
                    
                    <xsl:choose>
                        <xsl:when test="$skin = 'demo'">
                            <h2>Les articles</h2>
                            <p>Ils sont utilisés pour la plupart des contenus des pages : Présentation, Contact, Références...</p>
                            <h2>Les actualités</h2>
                            <p>Les actualités sont utilisées pour les différents évènements :
                                nouveautés produits, actualités de toute sorte, manifestations...
                            </p>
                            <h2>Les galeries photos</h2>
                            <p>Le contenu "galerie de photos" est utilisé pour présenter une galerie de photo avec diaporama</p>
                            <h2>Les galeries multimédia</h2>
                            <p>Le contenu "galerie multilmédia" est utilisé pour afficher une playlist de vidéos au format flash (.flv)</p>
                            <h2>FAQ</h2>
                            <p>Le contenu "FAQ" est utilisé présenter pour une foire aux questions (liste de questions/réponses)</p>
                        </xsl:when>
                        <xsl:when test="$skin = 'blog'">
                            <h2>Les billets</h2>
                            <p>Ce sont les billets ou posts du blog. Cliquez sur <b><i>Nouveau billet</i></b> pour créer un nouvel article/billet.</p>
                            <h2>Les articles</h2>
                            <p>Ils sont utilisés pour le contenus des autres pages du blog: Contact, Mentions légales, ...</p>
                            <h2>Contenu "A propos"</h2>
                            <p>The contenu "A propos" est utilisé pour présenter le ou les auteurs du blog.</p>
                        </xsl:when>
                    </xsl:choose>
                    
                    
                    <div class="clear-L"></div>
            </body>
        </html>
    </xsl:template>
    
    <xsl:template name="index-default">
        
    </xsl:template>
    
    <xsl:template name="index-blog">
    
    </xsl:template>
</xsl:stylesheet>                        
