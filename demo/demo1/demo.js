"use strict";
// //interface 接口 自定义约束结构
// //分号结尾
// interface Idata {
//   message: string;
//   success: boolean;
//   data: Ilist
// }
// interface Ilist {
//   list: {
//     id: number;
//     name: string;
//   }[];
// }
// interface IfatherData {
//   message: string;
//   success: boolean;
//   data?: {}
// }
// //子继承于父
// interface IsonData extends IfatherData {
//   children?: [];
// }
// let obj1: { a: number; b: number; c: number; } = { a: 1, b: 2, c: 3 };
// let obj2: { a: number; b?: string } = {
//   a: 1,
//   b: '你好'
// }
// let obj3: Idata = {
//   message: '成功',
//   success: true,
//   data: {
//     list: [
//       { id: 1, name: '张三' },
//       { id: 2, name: '李四' },
//     ]
//   }
// }
// let obj4: IsonData = {
//   message: '成功',
//   success: true,
//   data: {
//     list: [
//       { id: 2, name: '李四' },
//     ]
//   }
// }
// // Array<number | string>
// let arr: (number | string)[] = [1, 2, 3, 'apple', 'abc'];
// var arr1: number[] = [123, 123];
// let arr2: (number | boolean)[] = [1];
// let var1: (string | null) = null;
// function fun1(a: number, b: number = 2): number | void {
//   if (b) {
//     return a + b
//   }
// }
// function fun2(a: number, b: string): string {
//   return a + b
// }
// const fun3: (params1: number, params2: string) => string = (a, b): string => {
//   return a + b
// }
// console.log(arr);
// console.log(fun1(1, 3));
// console.log(obj3);
