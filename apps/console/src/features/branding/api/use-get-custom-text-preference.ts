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

import { HttpMethods } from "@wso2is/core/models";
import { I18nConstants } from "../../core/constants/i18n-constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { store } from "../../core/store";
import { CustomTextPreferenceConstants } from "../constants/custom-text-preference-constants";
import { BrandingPreferenceTypes } from "../models/branding-preferences";
import {
    CustomTextPreferenceAPIResponseInterface
} from "../models/custom-text-preference";

/**
 * Hook to get the branding preference text customizations from the API.
 *
 * @param shouldFetch - Should fetch the data.
 * @param name - Resource Name.
 * @param screen - Resource Screen.
 * @param locale - Resource Locale.
 * @param type - Resource Type.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetCustomTextPreference = <
    Data = CustomTextPreferenceAPIResponseInterface,
    Error = RequestErrorInterface>(
        shouldFetch: boolean,
        name: string,
        screen: string,
        locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
        type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            locale,
            name,
            screen,
            type
        },
        url: store.getState().config.endpoints.brandingTextPreference
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch? requestConfig : null, {
        shouldRetryOnError: false
    });

    if ((error?.response?.data as any)?.code
        === CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_NOT_CONFIGURED_ERROR_CODE) {
        return {
            data: null,
            error,
            isLoading: !error && !data,
            isValidating,
            mutate
        };
    }

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export default useGetCustomTextPreference;
