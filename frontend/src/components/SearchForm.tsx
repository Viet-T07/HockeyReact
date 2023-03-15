import React from "react";

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { Formik, Form, Field } from "formik";

interface ISearchFormProps {
  handleSubmit: (name: string) => any;
}

interface ISearchFormValues {
  name: string;
  numLines: number;
}

const SearchForm = ({ handleSubmit }: ISearchFormProps) => {
  const url = process.env.NEXT_PUBLIC_URL;
  const [{}, get] = useAxios({}, { manual: true });

  // Call the api => see if a name is returned => specify the error
  const validateName = (name: string) => {
    let error = "";
    get({ url: `${url}player/${name}` }).then((response) => {
      if (Object.keys(response.data).length === 0) {
        error = `No player matching the query ${name} was found`;
        return error;
      }
    });
    return error;
  };

  return (
    <Formik
      initialValues={{ name: "", numLines: 10 }}
      onSubmit={(values: ISearchFormValues) => {
        handleSubmit(values.name);
      }}
    >
      {(props) => (
        <Form>
          <Field name="name" validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor="name">Enter a Player name</FormLabel>
                <Input {...field} id="name" placeholder="name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Search
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SearchForm;
