export type Person = {
  firstName: string;
  lastName: string;
};

const ada: Person = {
  lastName: 'name',
  firstName: 'there ',
};

console.log('hello ', ada);
export function sayHello(p: Person): string {
  return `Hello ${p.firstName}!`;
}
