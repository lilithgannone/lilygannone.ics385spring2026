# QR Code Generator-HW4b

## Assignment Details
**Name:** Lilith Gannone<br>
**Date:** 02/06/2026<br>
**Course:** ICS 385 Spring 2026<br>
**Assignment:** Week 4b - QR Code<br>
**Disclaimer:** AI used to understand and write portions of this code. AI-generated code is labeled. My contributions are labeled. The AI comments created to increase my understanding are also included. 

## Overview
This project is an extension of the QR code project program. Students were tasked to take the initial QR project code and add functionalities, making it more user-friendly and safer for users to store their work without losing their previous QR codes. I began the project by asking Codex to add comments to the initial code so I understood what it did. I then thought about the additions I wanted to make. I created prompts and added a instuctional portion to the code to reflect these changes. I then utilized Codex to add the functionalities, periodically checking the program and making additional changes as needed. 

## What I Did
- Wrote the entirety of this readme.md file. 
- Created the plans and wrote the prompts for the added functionalities. 
- Wrote the instructional section and generated the banner with some assistance from AI for syntax.
- Reviewed code throughout the prompting process to ensure functionality.
- Tested program.
- Manually troubleshot the cybersecurity message function, as the initial formatting was not ideal.

## Initial functionality 
The initial program simply prompted for a URL with no validation measures and generated a QR code to qr_img.png, overwriting the existing file. A text file would also be generated, including the URL that was input by the user. No instructions were given to users and prompts were very minimal. 

## Added functionality
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

## How to begin:
- Open the 2.4 QR Code Project folder in VS Code.
- Open a new terminal in VS Code.
- Install dependencies by running: `npm install`
- Start the program by running: `node solution.js`
- Read the instructions, follow the prompts.





