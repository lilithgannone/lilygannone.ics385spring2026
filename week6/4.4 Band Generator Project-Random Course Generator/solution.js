import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("solution.ejs");
});

app.post("/submit", (req, res) => {
  const randomId = id[Math.floor(Math.random() * id.length)];
  const randomName = name[Math.floor(Math.random() * name.length)];
  res.render("solution.ejs", {
    id: randomId,
    name: randomName,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const id = [
"ICS 101",
"BUSN 150",
"SP 151",
"SP 251",
"COM 130",
"COM 145",
"ENG 100",
"BUS 120",
"MGT 120",
"MATH 115",
"PSY 100",
"SOC 100",
"MKT 120",
"ACC 201",
"ICS 110",
"ICS 169",
"ECON 131",
"ENG 209",
"ENG 200",
"ENG 225",
"BLAW 200",
"ACC 202",
"ECON 130",
"ICS 111",
"ICS 184",
"ICS 171",
"ICS 173",
"ICS 200",
"MATH 115T",
"ACC 300",
"BUS 310",
"BUS 320",
"BUS 495",
"BUS 496",
"BUS 393v",
"COM 353",
"COM 459",
"ICS 320",
"ICS 360",
"ICS 385",
"ICS 418",
"MGT 310",
"MKT 300",
"PHIL 323",
"HUM 400",
"ENG 316",

];

const name = [
"Composition I",
"Principles of Business",
"Principles of Management",
"Introduction to Statistics and Probability",
"Principles of Marketing",
"Introduction to Financial Accounting",
"Principles of Economics: Macroeconomics",
"Legal Environment of Business",
"Introduction to Managerial Accounting",
"Principles of Economics: Microeconomics",
"Intermediate Financial Accounting I",
"Statistical Analysis for Business Decisions",
"Entrepreneurship Opportunity Recognition and Evaluation",
"ABIT Capstone I",
"ABIT Capstone II",
"Introduction to Information Systems & Artificial Intelligence",
"Database Design & Development",
"Web Development and Administration",
"Systems Analysis & Designs",
"Professional Ethics",
"Changes & Choices",
"Advanced Research Writing",
"Digital Tools for the Information World",
"Personal & Public Speech",
"Principles of Effective Public Speaking",
"Communication - Speech",
"Interpersonal Communication I",
"Introduction to Psychology",
"Introduction to Sociology",
"Introduction to Computer Programming",
"Introduction to Information Security",
"Business & Managerial Writing",
"Composition II",
"Writing for Science and Technology",
"Intro to Computer Science I",
"Introduction to Networking",
"Introduction to Computer Security",
"Introduction to Data Science",
"Web Technology",
"Introduction to Statistics and Probability",
"Introduction to Statistics & Probability with Supplement",
"ABIT Cooperative Education",
"Conflict Management & Resolution",
"Intercultural Communication II",

];
