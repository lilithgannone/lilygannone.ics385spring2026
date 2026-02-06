# QR Code Generator-HW4b

## Assignment Details
**Name:** Lilith Gannone<br>
**Date:** 02/06/2026<br>
**Course:** ICS 385 Spring 2026<br>
**Assignment:** Week 4b - QR Code<br>
**Disclaimer:** AI (Codex) used to understand and write portions of this code. AI-generated code is labeled. My contributions are labeled. The AI comments created to increase my understanding are also included. 

## Overview
This project is an extension of the QR code project program. Students were tasked to take the initial QR project code and add functionalities to it, making it more user-friendly and safer for users to store their work without losing their previous QR codes. I began the project by asking Codex to add comments to the initial code so I understood what it did. I then thought about the additions I wanted to make. I created prompts and added an instructional portion to the code to reflect these changes. I then utilized Codex to add the functionalities, periodically checking the program and making additional changes as needed. 

## Initial Functionality 
The initial program simply prompted for a URL with no validation measures and generated a QR code to qr_img.png, overwriting the existing file. A text file would also be generated, including the URL that was input by the user. No instructions were given to users, and prompts were very minimal. 

## What I Did
- Researched QR codes for security, formatting, and ideal file type information. Investigated popular QR code generation sites. Went through the Udemy project. 
- Wrote the readme.md file.
- Created the plans and wrote the prompts for the added functionalities.
- Workshopped with AI about my ideas for the changes to see what's doable and realistic for a beginner programmer using AI assistance.
- Wrote the instructional section and generated the banner with some assistance from AI for syntax.
- Reviewed code throughout the prompting process to ensure functionality.
- Tested program.
- Manually troubleshot the cybersecurity message function, as the initial formatting was not ideal. It's still not ideal, but the current formatting is a lot better than the initial formatting.
- Reviewed completed code. Although I don't understand it all, reviewing helped give me a better understanding of the program. 

## Tests
- Tested the initial program to see what needed to be changed. 
- Ran initial test after I manually adjusted the instructions prior to AI coding help.
- Ran test on program after I prompted Codex to make changes (seen in added functionality).
- Some portions of the program were buggy or needed adjustment. Prompted for changes and tested the program by generating QR codes.
- Adjusted the sizing of the cybersecurity message and created QR codes about 5-10 times, adjusting the formatting.
- Ran a final test by creating a new folder and running the code as if I were a new user.
- Generated final QR codes- both PNG and SVG. 

## Added Functionality
- Start screen and instructions.
- Guiding messages for users that create a more streamlined process.
- Validation of URLs to ensure only URLs with valid formatting can be used to generate a QR code.
- Auto-correct adding in "https://" to URLs missing this info.
- File naming.
- No overwriting of existing QR codes.
- Completed QR codes go into their own folder.
- Simple personalization: border size selection for better scanning.
- Better error handling.
- Message added to SVG files: "Scan me. Please be mindful of quishing attacks when scanning QR codes". Users can now create a QR code and save it as an SVG file if they want the message to be included in the output. 
- Loop function to allow users to generate another code once they've completed a code. 

## File Structure
- index.js
- package.json
- package-lock.json
- solution.js
- README.md
- output file generated on the user's device for created QR codes 

## How to Begin (as if this were for someone utilizing the program):
- Open the QR Code Project folder in VS Code.
- Open a new terminal in VS Code.
- Install dependencies by running: `npm install`
- Start the program by running: `node solution.js`
- Read the instructions, follow the prompts.
















