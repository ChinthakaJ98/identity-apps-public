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

import Grid from "@oxygen-ui/react/Grid";
import { 
    VerticalStepper, 
    VerticalStepperStepInterface 
} from "@wso2is/common/src/components/vertical-stepper/vertical-stepper";
import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, Link, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import BuildLoginFlowIllustration from "./assets/build-login-flow.png";
import CustomizeStepsIllustration from "./assets/customize-steps.png";
import ApplicationSelectionModal from "../../../../../extensions/components/shared/application-selection-modal";

/**
 * Prop types of the component.
 */
type TOTPQuickStartPropsInterface = TestableComponentInterface;

/**
 * Quick start content for the TOTP authenticator.
 *
 * @param {TOTPQuickStartPropsInterface} props - Props injected into the component.
 *
 * @return {React.ReactElement}
 */
const TOTPQuickStart: FunctionComponent<TOTPQuickStartPropsInterface> = (
    props: TOTPQuickStartPropsInterface
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    /**
     * Vertical Stepper steps.
     * @return {VerticalStepperStepInterface[]}
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.totp.quickStart.steps.selectApplication.content"
                            }
                        >
                            Choose the <Link external={ false } onClick={ () => setShowApplicationModal(true) }> application </Link>
                            for which you want to set up TOTP login.
                        </Trans>
                    </Text>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.totp.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={ "extensions:develop.identityProviders.totp.quickStart.steps.selectTOTP.content" }
                        >
                            Go to <strong>Sign-in Method</strong> tab and click on <strong>Add OTP as a second
                            factor</strong> configure a basic TOTP flow.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowIllustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans i18nKey="extensions:develop.identityProviders.totp.quickStart.steps.selectTOTP.heading">
                    Select <strong>Add TOTP as a second factor</strong>
                </Trans>
            )
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey="extensions:develop.identityProviders.totp.quickStart.steps.customizeFlow.content"
                        >
                            Continue to configure the login flow as required.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ CustomizeStepsIllustration } size="huge"/>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.totp.quickStart.steps.customizeFlow.heading")
        }
    ];

    return (
        <>
            <Grid container spacing={ { xs: 2, md: 3 } } columns={ { xs: 4, sm: 8, md: 12 } }>
                <Grid xs={ 4 } sm={ 8 } md={ 12 }>
                    <PageHeader
                        className="mb-2"
                        imageSpaced={ false }
                        bottomMargin={ false }
                        title={ t("extensions:develop.identityProviders.totp.quickStart.heading") }
                    />
                    <Heading subHeading as="h6">
                        { t("extensions:develop.identityProviders.totp.quickStart.subHeading") }
                    </Heading>
                </Grid>
                <Grid xs={ 4 } sm={ 8 } md={ 12 }>
                    <VerticalStepper
                        alwaysOpen
                        isSidePanelOpen
                        stepContent={ steps }
                        isNextEnabled={ true }
                    />
                </Grid>
            </Grid>
            {
                showApplicationModal && (
                    <ApplicationSelectionModal
                        data-testid={ `${ testId }-application-selection-modal` }
                        open={ showApplicationModal }
                        onClose={ () => setShowApplicationModal(false) }
                        heading={ t("extensions:develop.identityProviders.totp.quickStart.addLoginModal.heading") }
                        subHeading={
                            t("extensions:develop.identityProviders.totp.quickStart.addLoginModal.subHeading")
                        }
                        data-componentid="connections"
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the component
 */
TOTPQuickStart.defaultProps = {
    "data-testid": "totp-authenticator-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TOTPQuickStart;
