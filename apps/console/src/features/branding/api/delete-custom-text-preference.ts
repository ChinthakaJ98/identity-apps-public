/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { I18nConstants } from "../../core/constants/i18n-constants";
import { store } from "../../core/store";
import { CustomTextPreferenceConstants } from "../constants/custom-text-preference-constants";
import { BrandingPreferenceTypes } from "../models/branding-preferences";
import { CustomTextPreferenceAPIResponseInterface } from "../models/custom-text-preference";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Delete the branding preference text customizations for a given screen and locale.
 *
 * @param preference - Text Customizations.
 * @param name - Resource Name.
 * @param screen - Resource Screen.
 * @param locale - Resource Locale.
 * @param type - Resource Type.
 * @returns Promise containing the response.
 */
const deleteCustomTextPreference = (
    name: string,
    screen: string,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG
): Promise<CustomTextPreferenceAPIResponseInterface> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        params: {
            locale,
            name,
            screen,
            type
        },
        url: store.getState().config.endpoints.brandingTextPreference
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    CustomTextPreferenceConstants
                        .ErrorMessages
                        .CUSTOM_TEXT_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                CustomTextPreferenceConstants.ErrorMessages.CUSTOM_TEXT_PREFERENCE_DELETE_ERROR.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

export default deleteCustomTextPreference;
