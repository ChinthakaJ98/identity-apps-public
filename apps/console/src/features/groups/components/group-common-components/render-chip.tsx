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

import { ChipProps } from "@oxygen-ui/react";
import Chip from "@oxygen-ui/react/Chip";
import { IdentifiableComponentInterface, RolesMemberInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { ChipMoreDetails } from "./chip-more-details";

interface RenderChipInterface extends IdentifiableComponentInterface, ChipProps {
    /**
     * Key of the chip.
     */
    key: string | number;
    /**
     * Callback to set the active option.
     */
    setActiveOption: (option: RolesMemberInterface) => void;
    /**
     * Primary text of the chip.
     */
    primaryText: string;
    /**
     * Option object.
     */
    option: RolesMemberInterface;
    /**
     * Active option object.
     */
    activeOption: RolesMemberInterface;
}

export const RenderChip: FunctionComponent<RenderChipInterface> = (
    props: RenderChipInterface
): ReactElement => {

    const {
        key,
        setActiveOption,
        primaryText,
        option,
        activeOption
    } = props;

    const [ popoverAnchorEl, setPopoverAnchorEl ] = useState<Element>(null);

    /**
     * Handles the mouse enter event of the chip.
     * 
     * @param event - Mouse event
     * @param option - Group or user object
     */
    const handleChipMouseEnter = (event: SyntheticEvent) => {
        event.stopPropagation();
        setPopoverAnchorEl(event.currentTarget);
        setActiveOption(option);
    };
    
    /**
     * Handles the mouse leave event of the chip.
     */
    const handleChipMouseLeave = () => {
        setPopoverAnchorEl(null);
        setActiveOption(null);
    };

    return (
        <>
            <Chip
                { ...props }
                key={ key }
                label={ primaryText }
                onMouseEnter={ handleChipMouseEnter }
            />
            {
                activeOption?.value === option.value
                    ? (
                        <ChipMoreDetails 
                            popoverAnchorEl={ popoverAnchorEl } 
                            onPopoverClose={ handleChipMouseLeave } 
                            primaryText={ primaryText } 
                        />
                    )
                    : null
            }
        </>
    );
};
