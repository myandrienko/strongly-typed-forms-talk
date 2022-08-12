/* "Локатор"

1. Повторяет форму исходного объекта
2. В каждое поле объекта добавляет информациб о пути к этому полю
3. Обращение к полю объекта порождает локатор для этого поля
4. По локатору можно вывести тип исходного значения
*/

// #region locator example
import { ReactElement } from "react";
import { Field } from "react-hook-form";
import { Locator, nameSymbol } from "./locator";

interface MyFormData {
  user: {
    name: string;
    email: string;
    age: number;
  };
}

() => {
  const locator: Locator<MyFormData> = {
    [nameSymbol]: "",
    user: {
      [nameSymbol]: "user",
      name: { [nameSymbol]: "user.name" },
      email: { [nameSymbol]: "user.email" },
      age: { [nameSymbol]: "user.age" },
    },
  };

  return <Field locator={locator.user.age} />;
};

declare function Field<T>(props: { locator: Locator<T> }): ReactElement;
// #endregion
