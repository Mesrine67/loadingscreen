import React from "react";
import { Flex, type FlexProps } from "@mantine/core";

type CustomFlexProps = {
  children?: React.ReactNode;
} & FlexProps;

const CustomFlex = React.forwardRef<HTMLDivElement, CustomFlexProps>(
  (props, ref) => {
    return (
      <Flex
        ref={ref}
        {...props}
        style={{
          ...props.style,
        }}
      />
    );
  }
);

CustomFlex.displayName = "CustomFlex";

export default CustomFlex;