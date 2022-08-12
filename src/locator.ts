export const nameSymbol = Symbol("name");
const typeSymbol = Symbol("type");

export type Locator<T> = (T extends object
  ? {
      [K in keyof T]: Locator<T[K]>;
    }
  : {}) & {
  [nameSymbol]: string;
  [typeSymbol]?: T;
};

const locatorProxyHandlers: ProxyHandler<{ prefix: string }> = {
  get(target, key) {
    if (key === nameSymbol) {
      return target.prefix;
    }

    if (typeof key === "symbol") {
      throw new Error("Symbols are not supported in form field names");
    }

    const nextPrefix = target.prefix ? `${target.prefix}.${key}` : key;
    return createLocator(nextPrefix);
  },

  has(target, key) {
    return key === nameSymbol;
  },
};

function createLocator(prefix: string = ""): unknown {
  return new Proxy({ prefix }, locatorProxyHandlers);
}

const locator = createLocator();

export function getLocator<T>() {
  return locator as Locator<T>;
}

export function unpackLocator(locator: Locator<unknown>) {
  return locator[nameSymbol];
}

const myLocator = getLocator<{ users: { age: number }[] }>();
const loc = myLocator.users[1].age;
console.log(unpackLocator(loc));
