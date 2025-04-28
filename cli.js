#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { renderReact } from './renderer.js';
import { validateSchema } from './app/validator.js';
import { exec } from 'child_process'; // Import exec from child_process to run shell commands
import util from 'util';

const execPromise = util.promisify(exec); // Promisify exec for easier async/await handling

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

  // Add the `npx create-react-app` command before proceeding
  const appName = options.includes('--appname') ? options[options.indexOf('--appname') + 1] : 'my-app';
  try {
    console.log(`🚀 Creating React app: ${appName}`);
    // await execPromise(`npx create-react-app ${appName}`); // Create the React app using `npx`

    if (fs.existsSync(appName) && fs.lstatSync(appName).isDirectory()) {
        console.error('The folder already exists! Try another name')
        return
    } else {
        await execPromise(`npx create-react-app@latest ${appName}`, async (error, stdout, stderr) => {
            if (error) {
              console.error(`Error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`stderr: ${stderr}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            const outputCode = renderReact(schema);
            const outputFile = path.join(`${appName}/src`, outputFilename);
            await fs.promises.writeFile(outputFile, outputCode);

            console.log(`✅ Polyform generated React code into ${outputFile}!`);
          });
    }

    
    console.log(`✅ React app ${appName} created successfully.`);
  } catch (error) {
    console.error('❌ Error while creating React app:', error);
    process.exit(1);
  }

  // Now render the React code after app creation
  

  // Write the generated React code to the output file
//   const outputPath = path.join(process.cwd(), `${appName}/src/${outputFilename}`); // Save inside the created app
//   await fs.promises.writeFile(outputPath, outputCode);

  
}

main();
