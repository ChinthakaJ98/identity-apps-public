/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";

/**
 * Prop types of the component.
 */
type OIDCWebApplicationCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the OIDC web application template creation wizard.
 *
 * @param {OIDCWebApplicationCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const OIDCWebApplicationCreateWizardHelp: FunctionComponent<OIDCWebApplicationCreateWizardHelpPropsInterface> = (
    props: OIDCWebApplicationCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    return (
        <div data-testid={ testId }>
            <Heading as="h5">
                { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                    ".heading.title") }
            </Heading>
            <p>
                { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                    ".heading.subTitle") }
            </p>
            <p>
                { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                    ".heading.example") }
            </p>
            <>
                <Divider/>
                <Heading as="h5">
                    { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                        ".protocol.title") }
                </Heading>
                <p>
                    { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                        ".protocol.subTitle") }
                </p>
            </>

            <Divider />

            <React.Fragment>
                <Heading as="h5">
                    { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                        ".authorizedRedirectURLs.title") }
                </Heading>
                <p>
                    { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                        ".authorizedRedirectURLs.subTitle") }
                </p>
                <p>
                    { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.template.common" +
                        ".authorizedRedirectURLs.example") }
                </p>
            </React.Fragment>
        </div>
    );
};

/**
 * Default props for the component
 */
OIDCWebApplicationCreateWizardHelp.defaultProps = {
    "data-testid": "oidc-web-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OIDCWebApplicationCreateWizardHelp;
