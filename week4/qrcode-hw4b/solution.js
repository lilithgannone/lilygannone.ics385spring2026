// Initial AI comments to increase understanding: Import inquirer to ask the user a question in the terminal.
import inquirer from "inquirer";
// Initial AI comments to increase understanding: Import qr-image to generate a QR code from a string (the URL).
import qr from "qr-image";
// Initial AI comments to increase understanding: Import the built-in fs module to write files to disk.
import fs from "fs";
// AI-Generated (Codex): Import the built-in path module to handle file paths safely.
import path from "path";

//Written by me. No AI (other than autofill from VS Code and help with function/ console syntax): added by me to output instructions to the user in the terminal. This is just a big string with some ASCII art at the top. It explains how to use the program and what it does.
function showBanner(){
  console.log(`

    ██████    ███████████        █████████               █████               █████████                                                    █████                      
  ███░░░░███ ░░███░░░░░███      ███░░░░░███             ░░███               ███░░░░░███                                                  ░░███                       
 ███    ░░███ ░███    ░███     ███     ░░░   ██████   ███████   ██████     ███     ░░░   ██████  ████████    ██████  ████████   ██████   ███████    ██████  ████████ 
░███     ░███ ░██████████     ░███          ███░░███ ███░░███  ███░░███   ░███          ███░░███░░███░░███  ███░░███░░███░░███ ░░░░░███ ░░░███░    ███░░███░░███░░███
░███   ██░███ ░███░░░░░███    ░███         ░███ ░███░███ ░███ ░███████    ░███    █████░███████  ░███ ░███ ░███████  ░███ ░░░   ███████   ░███    ░███ ░███ ░███ ░░░ 
░░███ ░░████  ░███    ░███    ░░███     ███░███ ░███░███ ░███ ░███░░░     ░░███  ░░███ ░███░░░   ░███ ░███ ░███░░░   ░███      ███░░███   ░███ ███░███ ░███ ░███     
 ░░░██████░██ █████   █████    ░░█████████ ░░██████ ░░████████░░██████     ░░█████████ ░░██████  ████ █████░░██████  █████    ░░████████  ░░█████ ░░██████  █████    
   ░░░░░░ ░░ ░░░░░   ░░░░░      ░░░░░░░░░   ░░░░░░   ░░░░░░░░  ░░░░░░       ░░░░░░░░░   ░░░░░░  ░░░░ ░░░░░  ░░░░░░  ░░░░░      ░░░░░░░░    ░░░░░   ░░░░░░  ░░░░░     
                                                                                                                                                                     

   Type "help" at any time to see instructions.
  `);
  }

  function showInstructions(){
  console.log(`
  
-------------------------------------

Hello! Welcome to the QR code generator.

This program will ask you to type in a URL, then it will create a QR code image and a text file with the URL you entered. You can name your files, and they will save in the output folder in the same directory as this script. 

Steps:
1. When prompted, respond Y or N to the question "Would you like to generate a QR code?"
2. Type in your URL when prompted. Press enter when you're done. Please note that the  URL must be valid. URLs missing "http://" or "https://" will be autocorrected to include "https://". Other invalid URLs may cause an error.
3. The program will ask you to name the QR code image file (without the extension). Type in your desired file name and press Enter. If blank, a default name will be used.
4. Choose a border style for your QR code from the options provided. You are selecting the width of the area around the QR code. Type in your selection as prompted and press Enter.
5. You will be prompted with a message that asks if you are complete. Follow the instructions as prompted.
6. You will be prompted to select an image file type. The QR code image will save as a PNG or SVG file. If you select SVG, you will have the option to include a cybersecurity disclaimer in the image. The disclaimer reads: "Scan Me. Please be mindful of quishing attacks when scanning QR codes". If you choose to include the disclaimer, it will be added as text below the QR code within the same SVG file.
7. The program will also save the URL you entered into a text file named after your chosen file name with a .txt extension.
8. You can find both files in the output folder in the same directory as this script.
9. If there is an error, an error message will be printed in the terminal.
10. Once completed, you'll be prompted to either generate another QR code or exit the program.
Note: To view instructions again at any time, simply type "help".


Thank you for using the QR code generator! We hope you find it useful and easy to use. If you have any feedback or suggestions for improvement, please let us know at gannone@hawaii.edu. Happy QR code generating!

Ready? Please type Y to generate a QR code or N to exit:

-------------------------------------
`);
  }

showBanner();
showInstructions();

// Initial AI comments to increase understanding: Start the inquirer prompt flow.
//Human update: updated prompt message.
// AI-Generated (Codex): Keep the prompt flow but extend it with validation, options, and looping.
const OUTPUT_DIR = "output";

// AI-Generated (Codex): Ensure the output folder exists.
function ensureOutputDir() {
  const outputPath = path.join(process.cwd(), OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  return outputPath;
}

// AI-Generated (Codex): Replace spaces with dashes and remove Windows-invalid characters.
function sanitizeBaseName(name) {
  const withoutSpaces = name.replace(/\s+/g, "-");
  return withoutSpaces.replace(/[<>:"/\\|?*\x00-\x1F]/g, "");
}

// AI-Generated (Codex): Add a disclaimer below the SVG without altering the QR itself.
// Human added: adjusted sizing
function addDisclaimerToSvg(svgText, disclaimer) {
  // AI-Generated (Codex): Prefer viewBox for reliable sizing with qr-image SVG output.
  const viewBoxMatch = svgText.match(/\bviewBox="([^"]+)"/i);
  if (!viewBoxMatch) {
    return svgText;
  }

  const viewBoxParts = viewBoxMatch[1].trim().split(/\s+/);
  if (viewBoxParts.length !== 4) {
    return svgText;
  }

  const vbX = Number(viewBoxParts[0]);
  const vbY = Number(viewBoxParts[1]);
  const vbWidth = Number(viewBoxParts[2]);
  const vbHeight = Number(viewBoxParts[3]);
  if (
    !Number.isFinite(vbX) ||
    !Number.isFinite(vbY) ||
    !Number.isFinite(vbWidth) ||
    !Number.isFinite(vbHeight)
  ) {
    return svgText;
  }

  const fontSize = Math.max(2, Math.floor(vbWidth * 0.010));
  const captionPadding = 4;
  const lineGap = 2;
  const captionHeight = fontSize * 2 + lineGap + captionPadding * 2;
  const newVbHeight = vbHeight + captionHeight;
  const textLine1Y = vbY + vbHeight + captionPadding + fontSize;
  const textLine2Y = textLine1Y + fontSize + lineGap;

  // AI-Generated (Codex): Escape XML special characters in the disclaimer text.
  const escapedLine1 = "Scan Me."
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
  const escapedLine2 = "Please be mindful of quishing attacks when scanning QR codes"
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  let updated = svgText.replace(
    /\bviewBox="[^"]*"/i,
    `viewBox="${vbX} ${vbY} ${vbWidth} ${newVbHeight}"`
  );

  // AI-Generated (Codex): Update height attribute if present (handles px).
  updated = updated.replace(/\bheight="([\d.]+)(px)?"/i, (match, value, unit) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return match;
    }
    const newHeight = numeric + captionHeight;
    const suffix = unit ? "px" : "";
    return `height="${newHeight}${suffix}"`;
  });

  const disclaimerBlock = `\n  <rect x="${vbX}" y="${vbY + vbHeight}" width="${vbWidth}" height="${captionHeight}" fill="white" />\n  <text x="${vbX + vbWidth / 2}" y="${textLine1Y}" fill="black" font-size="${fontSize}" text-anchor="middle" font-family="Arial, sans-serif">${escapedLine1}</text>\n  <text x="${vbX + vbWidth / 2}" y="${textLine2Y}" fill="black" font-size="${fontSize}" text-anchor="middle" font-family="Arial, sans-serif">${escapedLine2}</text>\n`;
  updated = updated.replace(/<\/svg>\s*$/i, `${disclaimerBlock}</svg>`);
  return updated;
}

// AI-Generated (Codex): Create a default filename using a timestamp.
function buildDefaultName() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `qr_${yyyy}${mm}${dd}_${hh}${min}${ss}`;
}

// AI-Generated (Codex): Find a unique base name so we never overwrite files.
function getUniqueBaseName(baseName, outputPath, imageExt) {
  let candidate = baseName;
  let counter = 2;
  while (
    fs.existsSync(path.join(outputPath, `${candidate}.${imageExt}`)) ||
    fs.existsSync(path.join(outputPath, `${candidate}.txt`))
  ) {
    candidate = `${baseName}_${counter}`;
    counter += 1;
  }
  return candidate;
}

// AI-Generated (Codex): Prompt for a URL with validation and help keyword handling.
async function askForUrl() {
  while (true) {
    const answers = await inquirer.prompt([
      {
        // Initial AI comments to increase understanding: This message shows up in the terminal.
        message:
          "Type in your URL. Please remember to include http:// or https:// at the beginning of your URL. If you forget, it will be added for you:",
        // Initial AI comments to increase understanding: The answer will be stored under answers.URL.
        name: "URL",
      },
    ]);

    const raw = String(answers.URL || "").trim();
    if (raw.toLowerCase() === "help") {
      showInstructions();
      continue;
    }

    if (raw.length === 0) {
      console.log("Please enter a URL (it cannot be blank).");
      continue;
    }

    if (/\s/.test(raw)) {
      console.log("URLs cannot contain spaces. Please try again.");
      continue;
    }

    let normalized = raw;
    if (!/^https?:\/\//i.test(raw)) {
      normalized = `http://${raw}`;
      console.log(`Protocol missing - using ${normalized}`);
    }

    try {
      // AI-Generated (Codex): Validate that the URL parses correctly.
      new URL(normalized);
      return normalized;
    } catch (err) {
      console.log("That doesn't look like a valid URL. Please try again.");
    }
  }
}

// AI-Generated (Codex): Prompt for a filename with help keyword handling.
async function askForBaseName() {
  while (true) {
    const answers = await inquirer.prompt([
      {
        message: "Enter a base filename (no extension). Leave blank for default:",
        name: "fileBase",
      },
    ]);

    const raw = String(answers.fileBase || "").trim();
    if (raw.toLowerCase() === "help") {
      showInstructions();
      continue;
    }

    if (raw.length === 0) {
      return buildDefaultName();
    }

    const sanitized = sanitizeBaseName(raw);
    if (sanitized.length === 0) {
      console.log("That filename isn't valid after sanitizing. Please try again.");
      continue;
    }

    return sanitized;
  }
}

// AI-Generated (Codex): Prompt for image type selection.
async function askForImageType() {
  // AI-Generated (Codex): Inform users about SVG-only disclaimer embedding before selection.
  console.log("Note: The cybersecurity disclaimer can only be embedded if you choose SVG. The disclaimer reads: Scan me. Please be mindful of quishing attacks when scanning QR codes.");
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "imageType",
      message: "Choose a file type:",
      choices: ["PNG", "SVG"],
    },
  ]);
  const type = String(answers.imageType || "PNG").toLowerCase();
  return type === "svg" ? "svg" : "png";
}

// AI-Generated (Codex): Prompt for border size selection.
async function askForBorder() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "border",
      message: "Choose a border size:",
      choices: ["Small", "Normal", "Large"],
    },
  ]);

  switch (answers.border) {
    case "Small":
      return 1;
    case "Large":
      return 8;
    case "Normal":
    default:
      return 4;
  }
}

// AI-Generated (Codex): Run one QR code generation flow.
async function generateOneQr() {
  try {
    const url = await askForUrl();
    const imageType = await askForImageType();
    const margin = await askForBorder();
    // AI-Generated (Codex): Ask about the disclaimer only when SVG is selected.
    let addDisclaimer = false;
    if (imageType === "svg") {
      const disclaimerAnswer = await inquirer.prompt([
        {
          type: "confirm",
          name: "useDisclaimer",
          message: "Add cybersecurity disclaimer text to the SVG file?",
          default: false,
        },
      ]);
      addDisclaimer = Boolean(disclaimerAnswer.useDisclaimer);
      if (addDisclaimer) {
        // AI-Generated (Codex): Print the exact disclaimer line that will be embedded.
        console.log("Added: Scan Me. Please be mindful of quishing attacks when scanning QR codes");
      }
    }
    const baseName = await askForBaseName();

    const outputPath = ensureOutputDir();
    const uniqueBase = getUniqueBaseName(baseName, outputPath, imageType);

    const imagePath = path.join(outputPath, `${uniqueBase}.${imageType}`);
    const textPath = path.join(outputPath, `${uniqueBase}.txt`);

    // Initial AI comments to increase understanding: Create a readable stream that outputs QR image data.
    // AI-Generated (Codex): For SVG with disclaimer, build the SVG text and append the caption.
    if (imageType === "svg" && addDisclaimer) {
      const svgBuffer = qr.imageSync(url, { type: imageType, margin });
      const svgText = svgBuffer.toString();
      const finalSvg = addDisclaimerToSvg(
        svgText,
        "Scan Me. Please be mindful of quishing attacks when scanning QR codes"
      );
      fs.writeFileSync(imagePath, finalSvg);
    } else {
      const qrStream = qr.image(url, { type: imageType, margin });
      // Initial AI comments to increase understanding: Pipe the QR image data into a PNG file.
      qrStream.pipe(fs.createWriteStream(imagePath));
    }

    // Initial AI comments to increase understanding: Save the URL text into a plain text file.
    fs.writeFile(textPath, url, (err) => {
      // Initial AI comments to increase understanding: If something fails, throw the error so we notice it.
      if (err) throw err;
      // Initial AI comments to increase understanding: Let the user know the file was written successfully.
      console.log("The file has been saved!");
    });

    console.log("\nQR code generated successfully!");
    console.log(`URL: ${url}`);
    console.log(`Image: ${imagePath}`);
    console.log(`Text: ${textPath}`);
    console.log(`Type: ${imageType.toUpperCase()} | Border: ${margin}`);
  } catch (error) {
    console.error("An error occurred while generating the QR code:", error);
  }
}

// AI-Generated (Codex): Main flow with start prompt and loop.
async function main() {
  try {
    const startAnswer = await inquirer.prompt([
      {
        type: "confirm",
        name: "start",
        message: "Would you like to generate a QR code?",
        default: true,
      },
    ]);

    if (!startAnswer.start) {
      console.log("Goodbye! Thanks for using the QR code generator.");
      return;
    }

    let keepGoing = true;
    while (keepGoing) {
      console.log("\n--- New QR Code ---");
      await generateOneQr();

      const againAnswer = await inquirer.prompt([
        {
          type: "confirm",
          name: "again",
          message: "Generate another QR code?",
          default: false,
        },
      ]);

      keepGoing = Boolean(againAnswer.again);
    }

    console.log("All done. Have a great day!");
  } catch (error) {
    // Initial AI comments to increase understanding: Handle any errors from the prompt.
    if (error.isTtyError) {
      // Initial AI comments to increase understanding: Prompt couldn't be rendered in the current environment.
    } else {
      // Initial AI comments to increase understanding: Something else went wrong.
      console.error("Unexpected error:", error);
    }
  }
}

main();
/* 
Initial AI comments to increase understanding: Steps this script follows.
Initial AI comments to increase understanding: 1. Use the inquirer npm package to get user input.
Initial AI comments to increase understanding: 2. Use the qr-image npm package to turn the user-entered URL into a QR code image.
Initial AI comments to increase understanding: 3. Create a txt file to save the user input using the native fs node module.
*/
