#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { renderReact } from './renderer.js';
import { validateSchema } from './app/validator.js';

async function main() {
  const args = process.argv.slice(2);

  const [command, inputFile, ...options] = args;

  if (command !== 'build') {
    console.error('❌ Unknown command:', command);
    process.exit(1);
  }

  const platformOptionIndex = options.indexOf('--platform');
  const platform = platformOptionIndex !== -1 ? options[platformOptionIndex + 1] : 'react';

  const outOptionIndex = options.indexOf('--out');
  const outputFilename = outOptionIndex !== -1 ? options[outOptionIndex + 1] : 'output.jsx';

  if (platform !== 'react') {
    console.error('❌ Only React platform is supported currently.');
    process.exit(1);
  }

  const schemaPath = path.resolve(process.cwd(), `./schemas/${inputFile}`);
  const schemaRaw = await fs.promises.readFile(schemaPath, 'utf-8');
  const schema = JSON.parse(schemaRaw);

  const validationResult = validateSchema(schema);

  if (!validationResult) {
    console.error('❌ Schema validation failed:');
    validationResult.errors.forEach((err, index) => {
      console.error(`${index + 1}. ${err}`);
    });
    process.exit(1);
  }

  const outputCode = renderReact(schema);

  const outputPath = path.join(process.cwd(), outputFilename);
  await fs.promises.writeFile(outputPath, outputCode);

  console.log(`✅ Polyform generated React code into ${outputFilename}!`);
}

main();
