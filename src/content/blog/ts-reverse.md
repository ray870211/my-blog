---
title: 'TypeScript 進階：使用 infer 關鍵字實現字串反轉'
description: '深入探討 TypeScript 的 infer 關鍵字，透過實際範例學習如何在條件類型中進行類型推斷，並實現一個能夠反轉字串的 Reverse 類型工具。'
date: 2023-12-11
tags: ['TypeScript', 'infer']
author: 'Ray'
draft: false
---

這此的挑戰主要是創建一個 Reverse，用於反轉給定字串中的字元。例如將 Revers<'rehsaD'>轉換成"Dasher"

---

## infer

先來了解一下 infer 的作用，infer 可以在 extends 中的條件語句中推斷待判斷的類型。

它的目的在於創造分支，增加了型別的表達能力。這樣寫的時候，當  `T`  能指派給  `U`，則該型別為  `X`，反之則型別為  `Y`。

我們可以將它比喻為一種“推斷”機制。當你使用 `infer` 時，你其實是在告訴 TypeScript：「請你在這個情境下幫我推斷出一個型別」。

一個簡單理解的例子，在這個範例下，還不會 infer 的情況會這樣寫

```ts
type Ids = number[];
type Names = string[];
type Unpacked<T> = T extends Names ? string : T extends Ids ? number : T;
type idType = Unpacked<Ids>; // idType 為 number
type nameType = Unpacked<Names>; // nameType 為string
```

用 infer 的話會這樣寫

```ts
type Unpacked<T> = T extends (infer R)[] ? R : T;

type idType = Unpacked<Ids>; // idType 為 number
type nameType = Unpacked<Names>; // nameType 為string
```

其他範例

### 範例 1：從 Promise 中推斷結果型別

在這個範例中，我們會建立一個型別幫助器（Type Helper），它可以從一個 Promise 中推斷出其解析（resolve）的值的型別。

```ts
type PromiseType<T> = T extends Promise<infer R> ? R : T;

// 使用範例
async function getStringAsync(): Promise<string> {
  return 'hello';
}

type ResultType = PromiseType<ReturnType<typeof getStringAsync>>;
// ResultType 被推斷為 string
```

### 範例 2：從函數型別中推斷參數型別

```ts
type FirstParameter<T> = T extends (infer P, ...args: any[]) => void ? P : never;

// 使用範例
function exampleFunction(x: number, y: string): any {
    // ...
}

type ExampleParam = FirstParameter<typeof exampleFunction>;
// ExampleParam 被推斷為 number

```

`FirstParameter<T>` 用於獲取函數的第一個參數的型別。這裡使用 `infer` 來捕獲第一個參數的型別。

### 範例 3：從陣列中推斷元素型別

```ts
type ElementType<T> = T extends (infer U)[] ? U : never;

// 使用範例
type ArrayType = ElementType<T[]>;
// ArrayType 被推斷為 string
```

在這裡，`ElementType<T>` 檢查 `T` 是否是一個陣列。如果是，它使用 `infer` 來推斷出陣列裡元素的型別。

這些範例展示了 `infer` 在各種不同情境下的用法，從基本的型別推斷到更複雜的函數和陣列操作。這些範例應該有助於你理解 `infer` 如何在實際程式碼中運用。

---

## 解題

從字串的開頭剝離每個字元，並將其添加到新字串的末尾，遞歸地執行此操作，直到原始字串為空。結果是原始字串的反轉版本。

```ts
type Reverse<Str extends string> = Str extends `${infer FirstChar}${infer Rest}`
  ? `${Reverse<Rest>}${FirstChar}`
  : Str;
```

假設字串`Str`為 "abcde" ，會先判斷 'a'是否符合 Str，因此`FirstChar`推斷為 a，`Rest`推斷為 bcde，執行`${Reverse<Rest>}${FirstChar}`。判斷'b'是否符合 Str ....

1. **首次匹配**：

   - `FirstChar` 推斷為 `"a"`（字符串的第一個字符）。
   - `Rest` 推斷為 `"bcde"`（剩餘的字符）。
   - 因此，`Reverse<"abcde">` 變成 `${Reverse<"bcde">}"a"`。

2. **對 `"bcde"` 進行遞歸**：

   - 對 `"bcde"` 使用相同的過程：
     - `FirstChar` 是 `"b"`，`Rest` 是 `"cde"`。
     - `Reverse<"bcde">` 變成 `${Reverse<"cde">}"b"`。
   - 現在，原始表達式變為 `${Reverse<"cde">}"b""a"`。

3. **繼續遞歸**：

   - 對 `"cde"`、`"de"` 和 `"e"` 重複相同的過程。
   - 每一步都把當前的 `FirstChar` 移到最後並對 `Rest` 進行遞歸。

4. **遞歸終止**：

   - 當到達單個字符 `"e"` 時，遞歸終止，因為這時 `Str` 只包含一個字符，所以直接返回它自己。
   - 因此，`Reverse<"e">` 為 `"e"`。

5. **組合結果**：

   - 逐步組合回溯的結果，最終得到 `"edcba"`。

### 過程示例

整個過程展開來看是這樣的：

```ts
Reverse<"abcde">
-> `${Reverse<"bcde">}"a"`

-> `${`${Reverse<"cde">}"b"`}"a"`

-> `${`${`${Reverse<"de">}"c"`}"b"`}"a"`

-> `${`${`${`${Reverse<"e">}"d"`}"c"`}"b"`}"a"`

-> `${`${`${`"e"`"d"`}"c"`}"b"`}"a"`

-> "edcba"
```
