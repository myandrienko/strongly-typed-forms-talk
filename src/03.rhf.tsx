import { useState } from "react";
import { Controller, FieldPath, FormProvider, useForm } from "react-hook-form";
import { NumberInput } from "./NumberInput";
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

function HookFormExample(props: { prefix: FieldPath<MyFormData> }) {
  const { control } = useForm({ defaultValues: initialValues });

  return (
    <FormProvider control={control}>
      <form>
        <Controller
          name={`dfksfsd.age`}
          render={({ field }) => <NumberInput {...field} />}
        />
      </form>
    </FormProvider>
  );
}
