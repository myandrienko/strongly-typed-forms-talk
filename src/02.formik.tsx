import { Field, Form, Formik } from "formik";
import { TextInput } from "./TextInput";

interface MyFormData {
  users: {
    name: string;
    email: string;
    age: number;
  }[];
}

const initialValues: MyFormData = {
  users: [
    {
      name: "Vasily Poupkine",
      email: "v.poupkine@example.com",
      age: 42,
    },
  ],
};

function FormikExample() {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form>
        <Field name="users[0].age" as={TextInput} />
      </Form>
    </Formik>
  );
}
