<%--
 ~
 ~ Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%
    String TENANT_DOMAIN = "tenantDomain";
    String TENANT_DOMAIN_SHORT = "t";
    String USER_TENANT_DOMAIN_SHORT = "ut";
    String SERVICE_PROVIDER_NAME_SHORT = "sp";
    
    String identityServerEndpointContextParam = application.getInitParameter("IdentityServerEndpointContextURL");
    String samlssoURL = "../samlsso";
    String commonauthURL = "../commonauth";
    String oauth2AuthorizeURL = "../oauth2/authorize";
    String oidcLogoutURL = "../oidc/logout";
    String openidServerURL = "../openidserver";
    String logincontextURL = "../logincontext";
    String longwaitstatusURL = "/longwaitstatus";
    
    String tenantDomain;
    String userTenantDomain;
    String tenantForTheming;
    String userTenant;
    String spAppName;
    if (IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
        tenantDomain = IdentityTenantUtil.getTenantDomainFromContext();
        tenantForTheming = tenantDomain;
        userTenant = tenantDomain;

        spAppName = request.getParameter(SERVICE_PROVIDER_NAME_SHORT);
        if (StringUtils.isBlank(spAppName) && StringUtils.isNotBlank((String) request.getAttribute(SERVICE_PROVIDER_NAME_SHORT))) {
            spAppName = (String) request.getAttribute(SERVICE_PROVIDER_NAME_SHORT);
        }

        String tenantDomainFromURL = request.getParameter(TENANT_DOMAIN_SHORT);
        if (StringUtils.isBlank(tenantDomainFromURL) && StringUtils.isNotBlank((String) request.getAttribute(TENANT_DOMAIN_SHORT))) {
            tenantDomainFromURL = (String) request.getAttribute(TENANT_DOMAIN_SHORT);
        }

        String tenantDomainOfUser = request.getParameter(USER_TENANT_DOMAIN_SHORT);
        if (StringUtils.isBlank(tenantDomainOfUser) && StringUtils.isNotBlank((String) request.getAttribute(USER_TENANT_DOMAIN_SHORT))) {
            tenantDomainOfUser = (String) request.getAttribute(USER_TENANT_DOMAIN_SHORT);
        }

        userTenantDomain = tenantDomainOfUser;

        if (StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)
            && StringUtils.equals(spAppName, "Console")) {
            tenantForTheming = IdentityManagementEndpointConstants.SUPER_TENANT;
        } else {
            if (StringUtils.isBlank(userTenantDomain)) {
                userTenantDomain = tenantDomainFromURL;
            }
            if (StringUtils.isBlank(userTenantDomain)) {
                userTenantDomain = tenantDomain;
            }
            if (StringUtils.isNotBlank(tenantDomainOfUser)) {
                tenantForTheming = tenantDomainOfUser;
            }
            if (StringUtils.equals(spAppName, "My Account")
                && StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)) {
                tenantForTheming = userTenantDomain;
                userTenant = userTenantDomain;
            }
        }
    } else {
        tenantDomain = request.getParameter(TENANT_DOMAIN);
        if (StringUtils.isBlank(tenantDomain) && StringUtils.isNotBlank((String) request.getAttribute(TENANT_DOMAIN))) {
            tenantDomain = (String) request.getAttribute(TENANT_DOMAIN);
        }

        String tenantDomainFromURL = request.getParameter(TENANT_DOMAIN_SHORT);
        if (StringUtils.isBlank(tenantDomainFromURL) && StringUtils.isNotBlank((String) request.getAttribute(TENANT_DOMAIN_SHORT))) {
            tenantDomainFromURL = (String) request.getAttribute(TENANT_DOMAIN_SHORT);
        }

        String tenantDomainOfUser = request.getParameter(USER_TENANT_DOMAIN_SHORT);
        if (StringUtils.isBlank(tenantDomainOfUser) && StringUtils.isNotBlank((String) request.getAttribute(USER_TENANT_DOMAIN_SHORT))) {
            tenantDomainOfUser = (String) request.getAttribute(USER_TENANT_DOMAIN_SHORT);
        }

        spAppName = request.getParameter(SERVICE_PROVIDER_NAME_SHORT);
        if (StringUtils.isBlank(spAppName) && StringUtils.isNotBlank((String) request.getAttribute(SERVICE_PROVIDER_NAME_SHORT))) {
            spAppName = (String) request.getAttribute(SERVICE_PROVIDER_NAME_SHORT);
        }

        if (StringUtils.isBlank(tenantDomain)) {
            tenantDomain = request.getParameter(IdentityManagementEndpointConstants.TENANT_DOMAIN);
            if (StringUtils.isBlank(tenantDomain) && StringUtils.isNotBlank((String) request.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN))) {
                tenantDomain = (String) request.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
            }
        }

        if (!StringUtils.isBlank(tenantDomainFromURL)) {
            tenantDomain = tenantDomainFromURL;
        }

        tenantForTheming = tenantDomain;
        userTenant = tenantDomain;
        userTenantDomain = tenantDomainOfUser;

        if (StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)
            && StringUtils.equals(spAppName, "Console")) {
            tenantForTheming = IdentityManagementEndpointConstants.SUPER_TENANT;
        } else {
            if (StringUtils.isBlank(userTenantDomain)) {
                userTenantDomain = tenantDomainFromURL;
            }
            if (StringUtils.isBlank(userTenantDomain)) {
                userTenantDomain = tenantDomain;
            }
            if (StringUtils.isNotBlank(tenantDomainOfUser)) {
                tenantForTheming = tenantDomainOfUser;
            }
            if (StringUtils.equals(spAppName, "My Account")
                && StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)) {
                tenantForTheming = userTenantDomain;
                userTenant = userTenantDomain;
            }
        }
    }

    if (!StringUtils.equals(tenantDomain, "carbon.super")) {
        identityServerEndpointContextParam = ServiceURLBuilder.create().setTenant(tenantDomain).build()
                .getAbsolutePublicURL();
    }

    if (StringUtils.isNotBlank(identityServerEndpointContextParam)) {

        samlssoURL = identityServerEndpointContextParam + "/samlsso";
        commonauthURL = identityServerEndpointContextParam + "/commonauth";
        oauth2AuthorizeURL = identityServerEndpointContextParam + "/oauth2/authorize";
        oidcLogoutURL = identityServerEndpointContextParam + "/oidc/logout";
        openidServerURL = identityServerEndpointContextParam + "/oidc/logout";
        logincontextURL = identityServerEndpointContextParam + "/logincontext";
        longwaitstatusURL = identityServerEndpointContextParam + "/longwaitstatus";
    }
%>
