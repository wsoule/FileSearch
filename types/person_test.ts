import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { Person, sayHello } from "./person.ts";

Deno.test("sayHello Function", () => {
  const grace: Person = {
    lastName: "hello",
    firstName: "Grace",
  }

  assertEquals("Hello Grace!", sayHello(grace));
});
