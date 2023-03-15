import React from "react";

import Select from "react-select";

interface IDropdownProps {
  options: Array<{ label: any; value: any }>;
  isSearchable?: boolean;
  onChange: (value: any) => any;
  value?: any;
  defaultValue?: any;
  width?: string;
  marginTop?: string;
  marginBottom?: string;
  marginRight?: string;
  label?: string;
}

const Dropdown = ({
  options,
  isSearchable = false,
  onChange,
  value,
  defaultValue,
  width,
  marginTop,
  marginBottom,
  marginRight,
  label,
}: IDropdownProps) => {
  const customStyles = {
    container: () => ({
      width: width ? width : "fit-content",
      marginTop: marginTop ? marginTop : "",
      marginBottom: marginBottom ? marginBottom : "",
      marginRight: marginRight ? marginRight : "",
      zIndex: 50,
    }),
    menu: () => ({
      maxWidth: "100%",
      background: "#1A202C",
      zIndex: 100,
    }),
  };

  return (
    <div>
      {label && label}
      <Select
        styles={customStyles}
        options={options}
        isSearchable={isSearchable}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        menuPosition="fixed"
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            neutral0: "#1A202C",
            primary25: "#4299e1",
            primary: "white",
            neutral80: "white",
          },
        })}
      />
    </div>
  );
};

export default Dropdown;
