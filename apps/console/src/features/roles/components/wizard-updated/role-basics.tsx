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

import { Alert, ListItemText } from "@oxygen-ui/react";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Link } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { DropdownProps } from "semantic-ui-react";
import { useApplicationList } from "../../../applications/api/application";
import { ApplicationListItemInterface } from "../../../applications/models";
import { history } from "../../../core";
import { AppConstants } from "../../../core/constants";
import { searchRoleList } from "../../api/roles";
import { RoleConstants } from "../../constants";
import { CreateRoleFormData, RoleAudiences, SearchRoleInterface } from "../../models";

const FORM_ID: string = "add-role-basics-form";

/**
 * Interface to capture role basics props.
 */
interface RoleBasicProps extends IdentifiableComponentInterface {
    /**
     * Initial values of the form.
     */
    initialValues: CreateRoleFormData;
    /**
     * Trigger submission
     */
    triggerSubmission: (submitFunctionCb: () => void) => void;
    /**
     * On submit callback.
     */
    onSubmit: (values: CreateRoleFormData) => void;
    /**
     * Set whether the next button is disabled.
     */
    setIsNextDisabled: (isDisabled: boolean) => void;
}

/**
 * Component to capture basic details of a new role.
 *
 * @param props - Role Basic prop types
 */
export const RoleBasics: FunctionComponent<RoleBasicProps> = (props: RoleBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmission,
        initialValues,
        setIsNextDisabled,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ roleAudience, setRoleAudience ] = useState<string>(RoleConstants.DEFAULT_ROLE_AUDIENCE);
    const [ isDisplayApplicationList, setIsDisplayApplicationList ] = useState<boolean>(false);
    const [ isDisplayNoAppScopeApplicatioError, setIsDisplayNoAppScopeApplicatioError ] = useState<boolean>(false);
    const [ isFormError, setIsFormError ] = useState<boolean>(false);
    const [ applicationSearchQuery, setApplicationSearchQuery ] = useState<string>(undefined);
    const [ assignedApplicationsSearching, setAssignedApplicationsSearching ] = useState<boolean>(false);
    const [ applicationListOptions, setApplicationListOptions ] = useState<DropdownProps[]>([]);
    const noApplicationsAvailable: MutableRefObject<boolean> = useRef<boolean>(false);

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading,
        error: applicationListFetchRequestError,
        mutate: mutateApplicationListFetchRequest
    } = useApplicationList("clientId", null, null, applicationSearchQuery);

    useEffect(() => {
        if (applicationListFetchRequestError) {
            setIsDisplayNoAppScopeApplicatioError(true);
            setIsDisplayApplicationList(false);

            return;
        }

        if (roleAudience === RoleAudiences.APPLICATION) {
            if (noApplicationsAvailable.current && !applicationSearchQuery) {
                setIsDisplayNoAppScopeApplicatioError(true);
                setIsDisplayApplicationList(false);
            } else {
                setIsDisplayNoAppScopeApplicatioError(false);
                setIsDisplayApplicationList(true);
            }
        } else {
            setIsDisplayNoAppScopeApplicatioError(false);
            setIsDisplayApplicationList(false);
        }
    }, [ applicationListFetchRequestError, roleAudience ]);

    useEffect(() => {
        const options: DropdownProps[] = [];

        applicationList?.applications?.map((application: ApplicationListItemInterface) => {
            if (!RoleConstants.READONLY_APPLICATIONS_CLIENT_IDS.includes(application?.clientId)) {
                options.push({
                    content: (
                        <ListItemText 
                            primary={ application.name } 
                            secondary={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." + 
                                "assignedApplication.applicationSubTitle.application") } 
                        />
                    ),
                    key: application.id,
                    text: application.name,
                    value: application.id
                });
            }
        });

        noApplicationsAvailable.current = (options.length === 0);

        setApplicationListOptions(options);
    }, [ applicationList ]);

    useEffect(() => {
        if (isFormError || isDisplayNoAppScopeApplicatioError) {
            setIsNextDisabled(true);
        } else {
            setIsNextDisabled(false);
        }
    }, [ isFormError ]);

    /**
     * Util method to collect form data for processing.
     *
     * @param values - contains values from form elements
     */
    const getFormValues = (values: CreateRoleFormData): CreateRoleFormData => {
        return {
            assignedApplication: values.roleAudience === RoleAudiences.APPLICATION 
                ? values.assignedApplication.toString()
                : null,
            roleAudience: values.roleAudience.toString(),
            roleName: values.roleName.toString()
        };
    };

    /**
     * The following function handles the search query for the groups list.
     */
    const searchApplications: DebouncedFunc<(query: string) => void> = 
        useCallback(debounce((query: string) => {
            setApplicationSearchQuery(query ? `name co ${query}` : null);
            mutateApplicationListFetchRequest().finally(() => {
                setAssignedApplicationsSearching(false);
            });
        }, RoleConstants.DEBOUNCE_TIMEOUT), []);

    /**
     * Handles the change of the search query of application list.
     */
    const onSearchChangeApplication = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setAssignedApplicationsSearching(true);
        searchApplications(data.searchQuery.toString().trim());
    };

    /**
     * Navigate to the API Resources page.
     */
    const navigateToApplications = () => history.push(AppConstants.getPaths().get("APPLICATIONS"));

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = async (values: CreateRoleFormData): Promise<CreateRoleFormData>=> {

        const errors: CreateRoleFormData = {
            assignedApplication: undefined,
            roleName: undefined
        };

        // Handle the case where the user has not selected an assigned application.
        if (roleAudience === RoleAudiences.APPLICATION && !values.assignedApplication?.toString().trim()) {
            errors.assignedApplication = t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                "assignedApplication.validations.empty", { type: "Role" });
        }
        
        // Handle the case where the user has not entered a role name.
        if (!values.roleName?.toString().trim()) {
            errors.roleName = t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                "validations.empty", { type: "Role" });
        } else {
            const searchData: SearchRoleInterface = {
                filter: "displayName eq " + values.roleName.toString(),
                schemas: [
                    "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                ],
                startIndex: 1
            };
            const response: AxiosResponse = await searchRoleList(searchData);
    
            if (response?.data?.totalResults > 0) {
                errors.roleName = t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                        "roleName.validations.duplicate", { type: "Role" });
            }    
        }

        if (errors.roleName || errors.assignedApplication) {
            setIsFormError(true);
        } else {
            setIsFormError(false);
        }

        return errors;
    };

    return (
        <Form
            data-testid={ componentId }
            data-componentid={ componentId }
            onSubmit={ (values: CreateRoleFormData) => onSubmit(getFormValues(values)) }
            triggerSubmit={ (submitFunction: () => void) => triggerSubmission(submitFunction) }
            id={ FORM_ID }
            uncontrolledForm={ true }
            validate={ validateForm }
            initialValues={ initialValues }
        >
            <Field.Input
                ariaLabel="roleName"
                inputType="identifier"
                data-componentid={ `${ componentId }-role-name-input` }
                type="text"
                name="roleName"
                defaultValue={ initialValues?.roleName }
                maxLength={ RoleConstants.ROLE_NAME_MAX_LENGTH }
                minLength={ RoleConstants.ROLE_NAME_MIN_LENGTH }
                label={
                    t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                        "roleName.label",{ type: "Role" })
                }
                placeholder={
                    t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                        "placeholder", { type: "Role" })
                }
                required
            />
            <div className="ui form required field">
                <label>
                    { t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.roleAudience.label") }
                </label>
                {
                    Object.values(RoleAudiences)
                        .map((audience: string, index: number) => (
                            <Field.Radio
                                key={ index }
                                ariaLabel="roleAudience"
                                name="roleAudience"
                                label={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." + 
                                    `roleAudience.values.${audience.toLowerCase()}`) }
                                value={ audience }
                                defaultValue={ initialValues?.roleAudience ?? RoleConstants.DEFAULT_ROLE_AUDIENCE }
                                data-componentid={ `${componentId}-${audience}-audience` }
                                listen={ () => setRoleAudience(audience) }
                                hint={ 
                                    index === Object.keys(RoleAudiences).length - 1 
                                        ? (
                                            <Trans 
                                                i18nKey= { "console:manage.features.roles.addRoleWizard.forms." + 
                                                    "roleBasicDetails.roleAudience.hint" }>
                                                Set the audience of the role.
                                                <b>Note that audience of the role cannot be changed.</b>
                                            </Trans>
                                        ) 
                                        : null 
                                        // TODO: need to add a learn more for this.
                                }
                            />
                        ))
                }
            </div>
            {
                !isDisplayNoAppScopeApplicatioError
                    ? (
                        <Alert severity="info">
                            {
                                roleAudience === RoleAudiences.ORG
                                    ? t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.notes" + 
                                        ".orgNote")
                                    : t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.notes" + 
                                        ".appNote")
                                // TODO: need to add a learn more for this.
                            }
                        </Alert>
                    ) : (
                        <Alert severity="error">
                            <Trans 
                                i18nKey= { "console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.notes" + 
                                    ".cannotCreateRole" }
                            >
                            You cannot create an application-scoped role because there are currently no applications 
                            that support application-scoped role. Please (
                                <Link
                                    data-componentid={ `${componentId}-link-api-resource-page` }
                                    onClick={ navigateToApplications }
                                    external={ false }
                                >
                                    create an application
                                </Link>
                            )
                            that supports application-scoped roles to proceed.
                            </Trans>
                        </Alert>
                    )
            }
            {
                isDisplayApplicationList
                    ? (
                        <Field.Dropdown
                            ariaLabel="assignedApplication"
                            name="assignedApplication"
                            label={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." + 
                                "assignedApplication.label") }
                            options={ applicationListOptions }
                            required={ isDisplayApplicationList }
                            value={ initialValues?.assignedApplication }
                            search
                            loading = { isApplicationListFetchRequestLoading || assignedApplicationsSearching }
                            data-componentid={ `${componentId}-typography-font-family-dropdown` }
                            hint={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." + 
                                    "assignedApplication.hint") }
                            placeholder={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." + 
                                "assignedApplication.placeholder") }
                            noResultsMessage={
                                isApplicationListFetchRequestLoading || assignedApplicationsSearching
                                    ? t("common:searching")
                                    : t("common:noResultsFound")
                            }
                            onSearchChange={ onSearchChangeApplication }
                        />
                    ) : null
            }
        </Form>
    );
};

/**
 * Default props for the component.
 */
RoleBasics.defaultProps = {
    "data-componentid": "add-role-basics-form"
};
