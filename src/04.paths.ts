// #region Типы шаблонных литералов
const a: `hello ${string} ${number}` = "hello world 9";

type Parser<T> = T extends `hello ${infer Name} ${infer Index}`
  ? [Name, Index]
  : never;

type R1 = Parser<"hello daniel 12">;
// #endregion

// #region GetByKey
type GetByKey<T, Key> = Key extends keyof T
  ? T[Key]
  : Key extends `${number}`
  ? number extends keyof T
    ? T[number]
    : never
  : never;
// #endregion

// #region GetByPath
type GetByPath<T, Path> = Path extends `${infer Key}.${infer Rest}`
  ? GetByKey<T, Key> extends never
    ? never
    : GetByPath<GetByKey<T, Key>, Rest>
  : GetByKey<T, Path>;
// #endregion

// #region example
interface MyFormData {
  users: {
    name: string;
    email: string;
    age: number;
  }[];
}

type R4 = GetByPath<MyFormData, "users">;
// #endregion

export {};
