import { ReactElement, ReactNode } from "react";
import { getLocator, Locator } from "./locator";
import { NumberInput } from "./NumberInput";
import { TextInput } from "./TextInput";

interface User {
  fullName: string;
  email: string;
  age: number;
}

interface MyFormData {
  users: User[];
}

const initialValues: MyFormData = {
  users: [
    {
      fullName: "Vasily Poupkine",
      email: "v.poupkine@example.com",
      age: 42,
    },
  ],
};

interface FieldProps<V> {
  locator: Locator<V>;
  children: (props: FieldProvidedProps<V>) => ReactNode;
}

interface FieldProvidedProps<V> {
  name: string;
  value: V;
  onChange: (...args: OnChangeParameters<V>) => void;
}

declare function Field<V>(props: FieldProps<V>): ReactElement; /* {
  const values = useFormContext();
  const name = unpackLocator(props.locator);
  const value = get(values, name);

  function setValue(newValue) {
    set(values, name, newValue);
  }
  ...
} */

function useForm<T>(initialValues: T) {
  return {
    n: getLocator<T>(),
  };
}

function StronglyTypedExample() {
  const { n } = useForm(initialValues);

  return (
    <Field locator={n.users[0].fullName}>
      {(props) => <TextInput {...props} />}
    </Field>
  );
}

function UserEditor(props: { locator: Locator<User> }) {
  return (
    <Field locator={props.locator.fullName}>
      {(props) => <NumberInput {...props} />}
    </Field>
  );
}

// #region Адаптеры
interface OnChangeAdapters<V> {
  default: [value: V];
}

// declare module "my-form-lib" {
interface OnChangeAdapters<V> {
  uikit: [event: unknown, value: V];
}
// }

type OnChangeParameters<V> = OnChangeAdapters<V>[keyof OnChangeAdapters<V>];

declare function registerOnChangeAdapter(
  adapter: <V>(...args: OnChangeParameters<V>) => V
): void;

registerOnChangeAdapter(
  <V extends unknown>(...args: OnChangeParameters<V>): V => {
    if (args.length === 2) {
      return args[1];
    }

    throw new Error();
  }
);
// #endregion

// #region Полиморфная совместимость

// #endregion

export {};
