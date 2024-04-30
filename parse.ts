import { parse } from 'https://deno.land/std@0.200.0/flags/mod.ts';

const flags = parse(Deno.args, {
  boolean: ['help', 'save'],
  string: ['name', 'color'],
  alias: {
    'help': 'h',
  },
  default: {
    'color': 'blue',
  },
});
console.dir(parse(Deno.args));
