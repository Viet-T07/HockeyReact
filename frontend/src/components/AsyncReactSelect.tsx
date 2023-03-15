import React from "react";

import AsyncSelect from "react-select/async";
import useAxios from "axios-hooks";

interface ISelectProps {
  id: string;
  onChange: (event: any) => void;
  width?: string;
  marginTop?: string;
  marginBottom?: string;
  marginRight?: string;
}

const AsyncReactSelect = ({
  id,
  onChange,
  width,
  marginTop,
  marginBottom,
  marginRight,
}: ISelectProps) => {
  const [{}, get] = useAxios({}, { manual: true, useCache: false });
  const customStyles = {
    container: () => ({
      width: width ? width : "fit-content",
      marginTop: marginTop ? marginTop : "",
      marginBottom: marginBottom ? marginBottom : "",
      marginRight: marginRight ? marginRight : "",
    }),
    menu: () => ({
      maxWidth: "100%",
      background: "#1A202C",
      zIndex: 100,
    }),
  };
  const handleInput = (searchInput: string) => {
    if (searchInput.trim().length >= 3) {
      return get({
        url: `https://suggest.svc.nhl.com/svc/suggest/v1/minactiveplayers/${searchInput}/99999`,
      }).then((response) => {
        return response.data.suggestions.map((player: string) => {
          const split = player.split("|");
          return {
            value: split[0],
            label: `${split[2]} ${split[1]}`,
          };
        });
      });
    }
  };
  return (
    <AsyncSelect
      id={id}
      styles={customStyles}
      instanceId={id}
      isClearable={true}
      loadOptions={handleInput}
      onChange={onChange}
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
  );
};

export default AsyncReactSelect;
