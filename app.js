const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const FULL_NAME = (process.env.FULL_NAME || "Md_Zaid_Tausif").toLowerCase();
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "10072003";
const EMAIL = process.env.EMAIL || "mdzaid.tausif2022@vitstudent.ac.in";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "22BCB0172";

const isNumericString = (s) => typeof s === "string" && /^-?\d+$/.test(s.trim());
const isAlphaString = (s) => typeof s === "string" && /^[A-Za-z]+$/.test(s.trim());

const alternatingCaps = (chars) =>
  chars.map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join("");

const buildConcatString = (data) => {
  const lettersInOrder = [];
  for (const token of data) {
    if (typeof token !== "string") continue;
    for (const ch of token) {
      if (/[A-Za-z]/.test(ch)) lettersInOrder.push(ch);
    }
  }
  const reversed = lettersInOrder.reverse();
  return alternatingCaps(reversed);
};

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body || {};

    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        message: "Invalid input: 'data' must be an array of strings."
      });
    }

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    for (const token of data) {
      const s = String(token);

      if (isNumericString(s)) {
        const n = parseInt(s, 10);
        (n % 2 === 0 ? even_numbers : odd_numbers).push(s);
        sum += n;
      } else if (isAlphaString(s)) {
        alphabets.push(s.toUpperCase());
      } else {
        special_characters.push(s);
      }
    }

    const concat_string = buildConcatString(data);

    return res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      message: "Unexpected server error."
    });
  }
});

app.get("/", (_req, res) => {
  res.json({ message: "BFHL API is running. POST to /bfhl" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BFHL API running on port ${PORT}`));

