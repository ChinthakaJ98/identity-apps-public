<%--
  ~ Copyright (c) 2019, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.EncodedControl" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="java.util.Calendar" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>

<%
    String lang = "en_US"; // Default lang is en_US
    String COOKIE_NAME = "ui_lang";
    Locale browserLocale = request.getLocale();
    Locale userLocale = browserLocale;
    String uiLocaleFromURL = request.getParameter("ui_locales");
    String localeFromCookie = null;
    String BUNDLE = "org.wso2.carbon.identity.application.authentication.endpoint.i18n.Resources";

    // Check cookie for the user selected language first
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(COOKIE_NAME)) {
                localeFromCookie = cookie.getValue();
            }
        }
    }

    // Set lang from the priority order
    if (localeFromCookie != null) {
        lang = localeFromCookie;

        try {
            String langStr = lang.split("_")[0];
            String langLocale = lang.split("_")[1];

            userLocale = new Locale(langStr, langLocale);
        } catch (Exception e) {
            // In case the language is defined but not in the correct format
            userLocale = browserLocale;
        }
    } else if (uiLocaleFromURL != null) {
        for (String localeStr : uiLocaleFromURL.split(" ")) {
            String langStr = localeStr.split("_")[0];
            String langLocale = localeStr.split("_")[1];

            Locale tempLocale = new Locale(langStr, langLocale);

            // Trying to find out whether we have resource bundle for the given locale
            try {
                ResourceBundle foundBundle = ResourceBundle.getBundle(BUNDLE, tempLocale);

                // If so, setting the userLocale to that locale. If not, set the browser locale as user locale
                // Currently, we only care about the language - we do not compare about country locales since our
                // supported locale set is limited.
                if (tempLocale.getLanguage().equals(foundBundle.getLocale().getLanguage())) {
                    userLocale = tempLocale;
                    break;
                } else if (tempLocale.getLanguage().equals("en") && foundBundle.getLocale().getLanguage().equals("")) {
                    // When the given locale is en - which is our fallback one, we have to handle it separately because
                    // returns and empty string as locale language
                    userLocale = tempLocale;
                    break;
                } else {
                    userLocale = browserLocale;
                }
            } catch (Exception e) {
                userLocale = browserLocale;
            }
        }
    } else {
        userLocale = browserLocale;
    }

    ResourceBundle resourceBundle = ResourceBundle.getBundle(BUNDLE, userLocale, new
        EncodedControl(StandardCharsets.UTF_8.toString()));
%>

<%!
    /**
     * Get the localized string for the given key.
     * Interacts with both the `resourceBundle` & the custom text from the Branding API.
     *
     * @param resourceBundle Resource bundle.
     * @param customText Custom text.
     * @param key Key of the localized string.
     * @return Localized string.
     */
    public String i18n(ResourceBundle resourceBundle, JSONObject customText, String key) {
        return i18n(resourceBundle, customText, key, null, true);
    }

    /**
     * Get the localized string for the given key.
     * Interacts with both the `resourceBundle` & the custom text from the Branding API.
     * Overloaded method with default value.
     *
     * @param resourceBundle Resource bundle.
     * @param customText Custom text.
     * @param key Key of the localized string.
     * @param defaultValue Default value.
     * @return Localized string.
     */
    public String i18n(ResourceBundle resourceBundle, JSONObject customText, String key, String defaultValue) {
        return i18n(resourceBundle, customText, key, defaultValue, true);
    }

    /**
     * Get the localized string for the given key.
     * Interacts with both the `resourceBundle` & the custom text from the Branding API.
     * Overloaded method with default value with the ability to not fallback to resource bundle and return "" as default.
     *
     * @param resourceBundle Resource bundle.
     * @param customText Custom text.
     * @param key Key of the localized string.
     * @param defaultValue Default value.
     * @param shouldFallbackToResourceBundle Should fallback to resource bundle.
     * @return Localized string.
     */
    public String i18n(ResourceBundle resourceBundle, JSONObject customText, String key, String defaultValue, boolean shouldFallbackToResourceBundle) {
        String localizedString = null;
        Calendar calendar = Calendar.getInstance();
        int currentYear = calendar.get(Calendar.YEAR);

        try {
            if (customText != null && customText.has(key)) {
                localizedString = Encode.forHtmlContent(customText.getString(key));
            } else {
                if (StringUtils.isNotBlank(defaultValue)) {
                    localizedString = Encode.forHtmlContent(defaultValue);
                } else if (shouldFallbackToResourceBundle) {
                    localizedString = AuthenticationEndpointUtil.i18n(resourceBundle, key);
                } else {
                    localizedString = "";
                }
            }
        } catch (Exception e) {
            // Return the key itself as a fallback
            localizedString = Encode.forHtmlContent(key);
        }

        // Replace newline characters with actual line breaks
        localizedString = localizedString.replace("\\n", "\n");

        return localizedString.replace("{{currentYear}}", String.valueOf(currentYear));
    }
%>
