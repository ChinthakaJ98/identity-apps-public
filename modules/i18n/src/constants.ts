/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

/**
 * Class containing i18n module constants.
 */
export class I18nModuleConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Name of the i18n module.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly MODULE_NAME: string = "@wso2is/i18n";

    /**
     * Common namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly COMMON_NAMESPACE: string = "common";

    /**
     * Dev portal namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly DEV_PORTAL_NAMESPACE: string = "devPortal";

    /**
     * Admin portal namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly ADMIN_PORTAL_NAMESPACE: string = "adminPortal";

    /**
     * Default fallback language.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly DEFAULT_FALLBACK_LANGUAGE: string = "en-US";
}
