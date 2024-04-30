/// <reference lib="deno.unstable" />
import greetings from './assets/greetings.json' assert { type: 'json' };
import { parse } from 'https://deno.land/std@0.200.0/flags/mod.ts';
import type { Args } from 'https://deno.land/std@0.200.0/flags/mod.ts';
const typedGreetings: string[] = greetings as Array<string>;

export const parseArguments = (args: string[]): Args => {
  // All boolean arguments.
  const booleanArgs = [
    'help',
    'save',
  ];

  // All string arguments.
  const stringArgs = [
    'name',
    'color',
  ];

  // List of aliases
  const alias = {
    'help': 'h',
    'save': 's',
    'name': 'n',
    'color': 'c',
  };

  return parse(args, {
    alias,
    boolean: booleanArgs,
    string: stringArgs,
    stopEarly: false,
    '--': true,
  });
};

const printHelp = (): void => {
  console.log(`Usage: greetme [OPTIONS...]`);
  console.log('\nOptional flags:');
  console.log('   -h, --help        Display this help and exit.');
  console.log('   -s, --save        Save settings for future greetings.');
  console.log('   -n, --name        Set your name for the greeting.');
  console.log('   -c, --color       Set the color of the greeting.');
};

/**
 * Main logic of CLI.
 */

const main = async (inputArgs: string[]): Promise<void> => {
  const args = parseArguments(inputArgs);

  // If help flag enabled, print help.
  if (args.help) {
    printHelp();
    Deno.exit(0);
  }

  let name: string | null = args.name;
  let color: string | null = args.color;
  let save: boolean = args.save;

  const kv = await Deno.openKv('/tmp/kv.db');
  let askToSave = false;

  // If there isn't any name or color, then prompt.
  if (!name) {
    // const useDbName = prompt('Would you like to use the saved name? y/N');
    // if (useDbName?.toUpperCase() === 'Y') {
    name = (await kv.get(['name'])).value as string;
    // }
    if (!name) {
      name = prompt('What is your name?');
      askToSave = true;
    }
  }

  if (!color) {
    // const useDbColor = prompt('Would you like to use the saved color? y/N');
    // if (useDbColor?.toUpperCase() === 'Y') {
    color = (await kv.get(['color'])).value as string;
    // }
    if (!color) {
      color = prompt('What is your favorite color?');
      askToSave = true;
    }
  }

  if (!save && askToSave) {
    const savePrompt: string | null = prompt(
      'Do you want to save these settings? Y/n',
    );
    save = savePrompt?.toUpperCase() === 'Y';
  }

  if (save) {
    await kv.set(['name'], name);
    await kv.set(['color'], color);
  }

  console.log(
    `%c${
      typedGreetings[Math.floor(Math.random() * greetings.length) - 1]
    }, ${name}!`,
    `color: ${color}; font-weight: bold`,
  );
};

/*
 * Run the CLI.
 */

main(Deno.args);
