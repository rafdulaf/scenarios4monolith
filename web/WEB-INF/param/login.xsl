<?xml version="1.0" encoding="UTF-8"?>
<!--
   Copyright 2016 Anyware Services
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
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:ametys="org.ametys.core.util.AmetysXSLTHelper"
                xmlns:math="java.lang.Math"
                xmlns:i18n="http://apache.org/cocoon/i18n/2.1">
    
    <xsl:import href="plugin:core-ui://pages/login/login.xsl"/>
    
    <xsl:template name="login-before">
       <div class="intro">
           <div class="textin">
                  <h1><i18n:text i18n:key="LOGIN_SCREEN_INTRO_AMETYS_TITLE" /></h1>
                  <p><i18n:text i18n:key="LOGIN_SCREEN_INTRO_AMETYS_DESCRIPTION" /></p>
                  <p><i18n:text i18n:key="LOGIN_SCREEN_INTRO_AMETYS_AVAILABLE_IDENTIFIERS" /></p>
                  <ul>
                      <li><strong>admin</strong> (mot de passe :<i> admin</i>)</li>
                      <li><strong>webmaster</strong> (mot de passe :<i> webmaster</i>)</li>
                      <li><strong>manager</strong> (mot de passe :<i> manager</i>)</li>
                      <li><strong>contrib</strong> (mot de passe :<i> contrib</i>)</li>
                  </ul>
            </div>
       </div>
    </xsl:template>
    
    <xsl:template name="login-right-column">
        <div class="wrapin left-column">
           <div class="intro">
               <div class="textin">
        
                      <h1><i18n:text i18n:key="LOGIN_SCREEN_INTRO_RESOURCES_TITLE" /></h1>
                      <p><i18n:text i18n:key="LOGIN_SCREEN_INTRO_RESOURCES_DESCRIPTION" /></p>
                      <ul class="ametys-links">
                        <li><a class="website" href="https://www.ametys.org" target="_blank"><span><i18n:text i18n:key="LOGIN_SCREEN_INTRO_RESOURCES_WEBSITE" /></span></a></li>
                        <li><a class="doc" href="https://docs.ametys.org" target="_blank"><span><i18n:text i18n:key="LOGIN_SCREEN_INTRO_RESOURCES_DOC" /></span></a></li>
                        <li><a class="forum" href="https://www.ametys.org/forum" target="_blank"><span><i18n:text i18n:key="LOGIN_SCREEN_INTRO_RESOURCES_FORUM" /></span></a></li>
                        <li><a class="issues" href="https://issues.ametys.org" target="_blank"><span><i18n:text i18n:key="LOGIN_SCREEN_INTRO_RESOURCES_ISSUES" /></span></a></li>
                      </ul>
               </div>
               
           </div>
        </div>
    </xsl:template>
    
    <xsl:template name="head-more">
       <style>
            div.wrapin div.intro {
               margin: 0 auto 20px auto;
               padding: 0;
            }
            div.wrapin div.intro .textin {
                box-sizing: border-box;
                vertical-align: top;
                color: #ffffff;
            }
            div.wrapin > * { margin: 0 auto; } 
            div.wrapin.login-form > * {
                max-width: 53em;
            }
            div.login div.login-part{ 
                max-width: 53em;
                padding-bottom: 4em;
            }
            div.login-form div.intro .textin,
            div.login div.login-part form{ max-width: 30em; margin: 0 auto; }
            div.wrapin:not(.login-form) > *{
                max-width: 53em;
            }
            div.intro .textin h1 {
                margin: 0.8em 0;
                line-height: 1em;
                color: #ffffff;
                font-size: 1.8em;
                font-weight: normal;
            }
            div.intro .textin p,
            div.intro .textin ul {
                margin: 0 0 0.2em 0;
                font-size: 1.4em;
            }
            div.intro .textin ul {
                margin: 0 0 0 0;
                padding: 0 20px;
            }
            div.intro .textin ul.ametys-links{ 
                padding: 0;
                margin: 2em 0 5em;
                display: flex;
                flex-flow: row wrap;
                border-bottom: 1px solid rgba(255, 255, 255, .2);
                list-style: none;
                font-size: 1.12em;
            }
            div.intro ul.ametys-links li { display: inline-flex; flex: 1;}
            div.intro ul.ametys-links a {
                display: block;
                margin-left: 0.25em;
                line-height: 1.6em;
                text-align: center;
                vertical-align: middle;
                text-decoration: none;
                color: #ffffff;
                position: relative;
                padding: .5em .4em;
            }
            
            div.intro ul.ametys-links :first-child {
                margin-left: 0;
            }
			div.intro ul.ametys-links a {
                color: rgba(255, 255, 255, 0.9);
            }
            div.intro ul.ametys-links a:hover  {
                color: rgba(255, 255, 255, 1);
                border-bottom: 1px solid #ffffff;
                margin-bottom:-1px;
                -webkit-transition-property: border-width;
                -webkit-transition-duration: 5s;
                -moz-transition-property: border-width;
                -moz-transition-duration: 5s;
                transition-property: border-width;
                transition-duration: 5s;
            }
            div.intro .ametys-links a:active  {
                color: rgba(255, 255, 255, 1);
                background-color: rgba(255, 255, 255, .2);
            }
            div.intro ul.ametys-links a:focus {
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                box-shadow: none;
                border-bottom: 1px solid #ffffff;
                margin-bottom:-1px;
            }
            div.intro ul.ametys-links a:before {
                text-indent: 0;
                font-family: "Font Awesome 6 Free Solid";
                font-size: 3em;
                display: block;
            }
            div.intro ul.ametys-links a:before{ padding: .5em; }
            div.intro a.website:before {
                content: "\f0ac";
            }
            div.intro a.doc:before {
                content: "\f02d";
            }
            div.intro a.forum:before {
                content: "\f086";
            }
            div.intro a.issues:before {
                content: "\f071";
            }
            
            div.wrapin.left-column {
                border-top: 1px solid rgba(255, 255, 255, .2); 
            }
            
            @media screen and (min-width: 961px){
                div.wrapin.left-column .textin:last-child{
                    min-width: 40em;
                }
                div.login div.login-part{ border-bottom-width: 0; }
                div.wrapin{     
                    padding-left: 2%;
                    padding-right: 2%;
                }
                div.wrapin.login-form {
                    width: 50%;
                    max-width: 50%;
                    float: right;
                    border-left: 1px solid rgba(255, 255, 255, .2);
                }
                div.wrapin.left-column {
                    width: 50%;
                    border-top-style: none; 
                }
                div.wrapin.left-column div.intro .textin p{
                    max-width: 53em;
                }
                div.wrapin{     
                    padding-left: 5%;
                    padding-right: 5%;
                }
            }
        </style>
    </xsl:template>
</xsl:stylesheet>
