/* Ковариантность

number -> number | string
42 -> number
{ value: 42 } -> { value: number }
() => 42 -> () => number
*/

// #region Пример ковариантности
type R1 = 42 extends number ? true : false;
type R2 = (() => 42) extends () => number ? true : false;
// #endregion

/* Контрвариантность

(value: number) => void -> (value: 42) => void
*/

// #region Пример контравариантности
type R3 = ((a: number) => void) extends (a: 42) => void ? true : false;
// #endregion

// #region Ограничения на параметры типа
interface R4<T extends { value: number }> {
  value: T;
}

type R5 = R4<{ value: 42 }>;
// #endregion

export {};
