Присваиваемость в тайпскрипте:

42 -> number  
() => 42 -> () => number  
(a: number) => void -> (a: 42) => void

Ключевое слово extends в условных типах и констрейнтах означает присваиваемость:

```ts
type R1 = 42 extends number ? true : false;
type R2 = (() => 42) extends () => number ? true : false;
type R3 = ((a: number) => void) extends (a: 42) => void ? true : false;
```

Formik: FieldAttributes<any> -> any

```ts
function FormikExample() {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form>
        <Field name="users[0].name" as={NumberInput} />
      </Form>
    </Formik>
  );
}
```

RHF: name должен быть путём

```ts
function HookFormExample() {
  const { control } = useForm({ defaultValues: initialValues });

  return (
    <form>
      <Controller
        control={control}
        name={`users.0.age`}
        render={({ field }) => <NumberInput {...field} />}
      />
    </form>
  );
}

type GetByKey<T, Key> = Key extends keyof T
  ? T[Key]
  : Key extends `${number}`
  ? number extends keyof T
    ? T[number]
    : never
  : never;

type GetByPath<T, Path> = Path extends `${infer Key}.${infer Rest}`
  ? GetByKey<T, Key> extends never
    ? never
    : GetByPath<GetByKey<T, Key>, Rest>
  : GetByKey<T, Path>;
```

Трюк: будем вместо имени передавать что-то вроде геттера

```ts
const nameSymbol = Symbol("name");

const namingProxyHandlers: ProxyHandler<{ prefix: string }> = {
  get(target, key) {
    if (key === nameSymbol) {
      return target.prefix;
    }

    if (typeof key === "symbol") {
      throw new Error("Symbols are not supported in form field names");
    }

    const nextPrefix = target.prefix ? `${target.prefix}.${key}` : key;
    return createNamingProxy(nextPrefix);
  },

  has(target, key) {
    return key === nameSymbol;
  },
};

function createNamingProxy(prefix: string = ""): unknown {
  return new Proxy({ prefix }, namingProxyHandlers);
}

function isNamingProxy(proxy: unknown): proxy is { [nameSymbol]: string } {
  return typeof proxy === "object" && proxy !== null && nameSymbol in proxy;
}

export function unpackNamingProxy(proxy: unknown) {
  if (isNamingProxy(proxy)) {
    return proxy[nameSymbol];
  }

  throw new Error("Provided value is not a naming proxy");
}

export const namingProxy = createNamingProxy();
```

Тогда можно реализовать Field так:

```ts
interface FieldProps<V> {
  name: V;
  children: (props: FieldProvidedProps<V>) => ReactNode;
}

interface FieldProvidedProps<V> {
  name: string;
  value: V;
  onChange: (value: V) => void;
}

declare function Field<V>(props: FieldProps<V>): ReactElement;
```

Адаптеры:

```ts
interface OnChangeAdapters<V> {
  default: [value: V];
  uikit: [event: unknown, value: V];
}

type OnChangeParameters<V> = OnChangeAdapters<V>[keyof OnChangeAdapters<V>];

declare function registerOnChangeAdapter(
  key: keyof OnChangeAdapters<unknown>,
  adapter: <V>(...args: OnChangeParameters<V>) => V
): void;

registerOnChangeAdapter(
  "uikit",
  <V extends unknown>(...args: OnChangeParameters<V>): V => {
    if (args.length === 2) {
      return args[1];
    }

    throw new Error();
  }
);
```

Полиморфный компонент:

1. Собственные свойства (включая as)
2. Свойства низлежащего компонента (будут переданы как есть)
3. Свойства, которые полиморфные компонент сам предоставит низлежащему
   компоненту

```ts
type FieldProps<V, P> = FieldOwnProps<V, P> &
  Omit<P, keyof FieldOwnProps<V, P> | keyof FieldProvidedProps<V>>;

interface FieldOwnProps<V, P> {
  name: V;
  as: FieldProvidedProps<V> extends P ? ComponentType<P> : never;
}

interface FieldProvidedProps<V> {
  name: string;
  value: V;
  onChange: (...args: OnChangeParameters<V>) => void;
}
```

Проверка "в правильную сторону":

```ts
type IsComponentFieldCompatible<V, P> = FieldProvidedProps<V> extends P
  ? true
  : false;

type R1 = IsComponentFieldCompatible<number, NumberInputProps>;
type R2 = IsComponentFieldCompatible<string, NumberInputProps>;
```

Итого:
