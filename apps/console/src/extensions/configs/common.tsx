/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { CommonConfig } from "./models";

export const commonConfig: CommonConfig = {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: false
    },
    blockLoopBackCalls: false,
    checkForUIResourceScopes: false,
    enableDefaultBrandingPreviewSection: true,
    enableDefaultPreLoader: true,
    enableOrganizationAssociations: false,
    footer: {
        customClassName: "console-footer"
    },
    header: {
        headerQuickstartMenuItem: "QUICKSTART",
        renderAppSwitcherAsDropdown: false
    },
    leftNavigation: {
        isLeftNavigationCategorized: {
            develop: false,
            manage: true
        }
    },
    primaryUserstoreOnly: true,
    useExtendedRoutes: false,
    userEditSection: {
        isGuestUser: true,
        showEmail: true
    }
};
