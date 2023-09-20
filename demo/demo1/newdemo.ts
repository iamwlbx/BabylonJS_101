// 类 class
// class Person {
//   private userName: string;
//   private userAge: number;
//   constructor(name: string, age: number) {
//     this.userName = name;
//     this.userAge = age;
//     alert(this.run());
//   }
//   private run(addAge: number = 1): string {
//     this.userAge += addAge
//     return this.userName + this.userAge
//   }
// }
// new Person("张三", 18)
/* ———————————————————————————————————————————————————————————————————— */
// 修饰符
// readonly:只读
// interface demo1 {
//   a: number;
//   b: string;
//   readonly c: {}
// }

// public(默认)

// private   类的内部访问
// protected 当前类和其子类内部访问
// class School {
//   protected grade: string = '';
//   private classname: string = '';
// }
// class student extends School {
//   public run(): string {
//     return this.grade
//   }
// }
/* ———————————————————————————————————————————————————————————————————— */
// 抽象类: abstract
// 不完成具体功能
// 不能new
// 抽象类可以继承，继承后必须实现该类的抽象方法
// abstract class Person {
//   abstract run(): void;
// }
// class student extends Person {
//   run(): void {}
// }
/* ———————————————————————————————————————————————————————————————————— */
// implements:约束类的规则
// interface Ip1 {
//   name: string | null;
//   age: number;
// }
// interface Ip2 {
//   change(): void;
// }
// class Person implements Ip1, Ip2 {  // Ip1,Ip2 累加规则
//   name = null;
//   age = 18;
//   change(): void {  }
// }
/* ———————————————————————————————————————————————————————————————————— */
// 泛型
// function fun1<T>(arg: T): T {
//   return arg
// }
// fun1<string>('123')

// function fun2<N, S>(a: N, b: S) {
//   return
// }
// fun2<number, string>(10, "2")
// fun2<number[], boolean>([1, 2, 3], true)

// function fun3<T extends string>(arg: T) {
//   return arg.length
// }
// fun3<string>("你好啊")

// function fun4<T extends string | string[]>(arg: T) {
//   return arg.length
// }
// fun4<string>('你好啊')
// fun4<string[]>(['a', 'b', 'c', 'd'])
/* ———————————————————————————————————————————————————————————————————— */
//接口泛型
// interface Ilen {
//   length: number  //所有有length的类型，或者传入arg有length属性
// }
// function fun5<T extends Ilen, U>(arg: T): number {
//   return arg.length
// }
// fun5<string[], string>(['a', 'b', 'c', 'd'])
// fun5<number[], number>([1, 2, 3, 4, 5])
// fun5({
//   name: '张三',
//   age: 20,
//   length: 30
// })

// interface Nstudent {
//   username: number
// }
// class Student<T extends string | Nstudent, U>{
//   username: T;
//   userage: U;
//   constructor(name: T, age: U) {
//     this.username = name;
//     this.userage = age
//   }
//   public sayHi(): string {
//     // return this.username + this.userage.toString()
//     return `${this.username}${this.userage}`
//   }
// }
// const xiaozhang = new Student<string, number>("小李", 17)
// const xiaoli = new Student<any, number>(1, 17)
// console.log(xiaoli.sayHi());
// console.log(xiaozhang.sayHi());
/* ———————————————————————————————————————————————————————————————————— */
// 装饰器    在tsconfig.json中配置 "experimentalDecorators": true,
// 类装饰器（无法传参）
// function fun1(target: any) {  //target = Person1
//   target.prototype.userName = '张三';
//   target.age = 19
// }
// @fun1 //  =  fun1(Person1)
// class Person1 {
//   //
// }
// let p1 = new Person1();
// //@ts-ignore
// console.log(p1.userName);

//装饰器工厂(传参)
// function fun1(data: any) {
//   return function (t: any) {
//     t.prototype.userName = data.name;
//     t.prototype.userAge = data.age;
//   }
// }
// @fun1({
//   name: '张三',
//   age: 18
// })
// class Person2 {

// }
// const p2 = new Person2()
// //@ts-ignore
// console.log(p2.userName, p2.userAge);

// 装饰器组合：
// 执行顺序:
// 从上至下执行所有的装饰器工厂，拿到所有的装饰器 => 装饰器工厂是把装饰器放在return中
// 再从下至上执行所有装饰器
