// General Aptitude (15 marks, common to every GATE paper): short lessons with the rules that matter and worked examples.
// Each worked example's arithmetic is checked in scripts/ga-lessons-test.mts.

export type Example = { q: string; a: string };
export type Lesson = { slug: string; area: "Verbal" | "Quantitative" | "Analytical" | "Spatial"; title: string; why: string; rules: string[]; examples: Example[]; traps: string[] };

export const GA_AREAS = [
  { area: "Verbal", subject: "Verbal Aptitude", marks: "about 5 of the 15 marks" },
  { area: "Quantitative", subject: "Quantitative Aptitude", marks: "about 5 of the 15 marks" },
  { area: "Analytical", subject: "Analytical Aptitude", marks: "about 3 of the 15 marks" },
  { area: "Spatial", subject: "Spatial Aptitude", marks: "about 2 of the 15 marks" },
] as const;

export const GA_LESSONS: Lesson[] = [
  {
    slug: "grammar-agreement-tenses", area: "Verbal", title: "Grammar: agreement, tenses, articles and prepositions",
    why: "Sentence-correction and fill-in-the-blank questions reward a few rules applied calmly.",
    rules: [
      "The verb agrees with the real subject, not the word next to it: \"The list of items is long.\"",
      "\"Neither\", \"either\", \"each\" and \"everyone\" take a singular verb. \"The number of students is…\" is singular; \"A number of students are…\" is plural.",
      "Present perfect (have/has + past participle) links the past to now: \"I have lived here since 2020.\" Use simple past for a finished time: \"I lived there in 2019.\"",
      "A or an follows the sound, not the letter: \"an hour\", \"a university\". Use \"the\" for something specific or unique: \"the Sun\".",
      "Fixed pairs: different from, interested in, afraid of, capable of, prefer X to Y.",
    ],
    examples: [
      { q: "Choose the correct sentence: (a) Neither of the answers are right. (b) Neither of the answers is right.", a: "(b). \"Neither\" is singular, so the verb is \"is\"." },
      { q: "Fill in: \"She ___ in Pune since 2021.\" (lives / has lived)", a: "\"has lived\". \"Since\" points to a period that continues until now." },
    ],
    traps: ["Do not pick the verb that sounds right next to a plural noun in between (\"the cost of the books are\" is wrong).", "Watch for \"one of the\" + plural noun + singular verb: \"One of the reasons is…\"."],
  },
  {
    slug: "vocabulary-sentence-completion", area: "Verbal", title: "Vocabulary, synonyms, antonyms and sentence completion",
    why: "These are the quickest marks in the paper if you read for meaning and eliminate.",
    rules: [
      "Read the whole sentence first and guess the missing word's meaning (positive or negative, cause or contrast) before you look at the options.",
      "Linking words decide the answer: \"however\", \"although\", \"but\" signal contrast; \"therefore\", \"hence\" signal result; \"and\" keeps the same direction.",
      "Cross out options that don't fit the grammar, then the tone, then pick from what remains.",
      "For antonyms, find the exact meaning of the given word first, then its opposite, not just a different word.",
      "Learn word families: nocturnal (night) and diurnal (day); frugal (careful with money) and lavish; candid (honest) and evasive.",
    ],
    examples: [
      { q: "The antonym of \"nocturnal\" is: normal / diurnal / abnormal / exceptional.", a: "diurnal. Nocturnal means active at night; diurnal means active in the day." },
      { q: "\"Although the plan looked flawless, it ___ at the first test.\" (succeeded / failed)", a: "failed. \"Although\" sets up a contrast between a flawless look and the result." },
    ],
    traps: ["A word that looks like the stem (\"normal\" for \"nocturnal\") is usually a trap.", "Don't pick a word because you know it; pick it because it fits the sentence."],
  },
  {
    slug: "percentages-profit-loss", area: "Quantitative", title: "Percentages, profit and loss",
    why: "The most frequent quantitative topic; every question reduces to a multiplier.",
    rules: [
      "x% of y equals y% of x. To increase by p%, multiply by (1 + p/100); to decrease by p%, multiply by (1 − p/100).",
      "Two changes multiply: up a% then down b% gives a net change of (a − b − ab/100)%.",
      "Profit % = (SP − CP) / CP × 100. Selling price after a discount d%: SP = MP × (1 − d/100).",
      "Work from the base: percentage change is always on the starting value.",
    ],
    examples: [
      { q: "A price rises 20% and then falls 20%. What is the net change?", a: "20 − 20 − (20×20)/100 = −4%. A fall of 4%." },
      { q: "An item with marked price ₹500 is sold at 20% off. Its cost price is ₹320. What is the profit %?", a: "SP = 500 × 0.8 = ₹400. Profit = 80 on 320, so 25%." },
    ],
    traps: ["Equal up and down percentages do not cancel out.", "Profit % is on cost price, not selling price, unless the question says otherwise."],
  },
  {
    slug: "ratio-average-mixtures", area: "Quantitative", title: "Ratio, averages and mixtures",
    why: "Short questions where setting up one line of working is the whole solution.",
    rules: [
      "To divide a total in the ratio a : b, the parts are a/(a+b) and b/(a+b) of the total.",
      "Weighted average = (n₁a₁ + n₂a₂) / (n₁ + n₂). The combined average lies between the two averages, nearer the larger group.",
      "Mixtures (alligation): the quantities are in the inverse ratio of the distances from the mean price.",
    ],
    examples: [
      { q: "Divide ₹4500 in the ratio 2 : 3.", a: "Parts are 2/5 and 3/5 of 4500: ₹1800 and ₹2700." },
      { q: "30 students average 60 marks and 20 students average 70. What is the average of all 50?", a: "(30×60 + 20×70) / 50 = (1800 + 1400) / 50 = 64." },
    ],
    traps: ["Never average two averages without weighting by group size.", "Check that the parts add back up to the total."],
  },
  {
    slug: "time-work-speed", area: "Quantitative", title: "Time and work, speed and distance",
    why: "Two ideas cover almost every question: rates add, and distance = speed × time.",
    rules: [
      "If a job takes t days, the daily rate is 1/t. Working together, rates add: 1/a + 1/b.",
      "Distance = speed × time. For equal distances at speeds x and y, the average speed is 2xy / (x + y), not (x + y)/2.",
      "Km/h to m/s: multiply by 5/18. Two trains moving in opposite directions: relative speed is the sum; in the same direction, the difference.",
      "For trains crossing each other, the distance to cover is the sum of the lengths.",
    ],
    examples: [
      { q: "A can finish a job in 12 days and B in 6 days. How long together?", a: "1/12 + 1/6 = 3/12 = 1/4 of the job a day, so 4 days." },
      { q: "A car goes at 40 km/h one way and returns at 60 km/h. What is the average speed for the round trip?", a: "2 × 40 × 60 / (40 + 60) = 48 km/h." },
      { q: "Trains of 100 m and 150 m move towards each other at 60 and 40 km/h. How long to cross?", a: "Relative speed 100 km/h = 100 × 5/18 m/s. Distance 250 m, so time = 250 ÷ (500/18) = 9 seconds." },
    ],
    traps: ["Do not average speeds arithmetically over equal distances.", "Convert units before you divide."],
  },
  {
    slug: "numbers-series", area: "Quantitative", title: "Numbers, divisibility and number series",
    why: "Quick pattern questions; a minute of structure beats guessing.",
    rules: [
      "Divisible by 3 or 9 if the digit sum is; by 11 if the alternating digit sum is a multiple of 11; by 4 if the last two digits are.",
      "For series, check in this order: differences, differences of differences, ratios, alternating patterns, squares and cubes.",
      "Remainders: (a + b) mod n = (a mod n + b mod n) mod n, and the same for multiplication.",
    ],
    examples: [
      { q: "Next term: 2, 6, 12, 20, ?", a: "Differences are 4, 6, 8, so the next is +10: 30." },
      { q: "Next term: 3, 6, 12, 24, ?", a: "Each term doubles: 48." },
      { q: "Is 2728 divisible by 11?", a: "Alternating sum 2 − 7 + 2 − 8 = −11, a multiple of 11, so yes." },
    ],
    traps: ["Some series need two patterns on alternate terms.", "Check your pattern on every term, not just the first three."],
  },
  {
    slug: "logical-reasoning", area: "Analytical", title: "Logical reasoning: syllogisms, relations, directions and seating",
    why: "Four small skills that are easier with a quick diagram.",
    rules: [
      "Syllogisms: \"All A are B\" and \"All B are C\" give \"All A are C\". \"Some A are B\" can be turned round to \"Some B are A\". \"No A is B\" can be turned round to \"No B is A\". Draw circles, don't trust intuition.",
      "Blood relations: draw a small family tree, one generation per row, and mark each person's gender as you learn it.",
      "Directions: put each move on a grid. A right-angle path gives a straight-line distance by Pythagoras.",
      "Seating: place the fixed facts first (positions given), then use the \"next to\" and \"not next to\" clues to eliminate.",
    ],
    examples: [
      { q: "All engineers are graduates. All graduates are readers. Which is certain?", a: "All engineers are readers (the chain A→B→C)." },
      { q: "A walks 3 km north and then 4 km east. How far is A from the start in a straight line?", a: "√(3² + 4²) = 5 km." },
      { q: "A is B's sister and B is C's father. How is A related to C?", a: "A is C's aunt (father's sister)." },
    ],
    traps: ["\"Some\" never means \"all\", and it never means \"not all\" either, in a strict syllogism.", "Re-read which way a relation points: \"A is the father of B\" is not \"B is the father of A\"."],
  },
  {
    slug: "spatial-cubes-folding", area: "Spatial", title: "Spatial reasoning: cubes, dice and paper folding",
    why: "Two minutes of structure turns these from guesswork into counting.",
    rules: [
      "A cube has 6 faces. On a standard die opposite faces sum to 7. Faces that are opposite are never seen together.",
      "A painted n×n×n cube cut into unit cubes: 8 corners have 3 painted faces; 12(n−2) edge cubes have 2; 6(n−2)² face cubes have 1; (n−2)³ inside cubes have none.",
      "Paper folding: a cut or hole through a folded sheet repeats on the mirror side of every fold when you unfold. Folded once, one hole becomes 2; folded twice, 4.",
      "Mirror images flip left and right; water images flip top and bottom.",
    ],
    examples: [
      { q: "A painted 4×4×4 cube is cut into 64 unit cubes. How many have exactly 2 painted faces?", a: "12 × (4 − 2) = 24. (Check: 8 + 24 + 24 + 8 = 64.)" },
      { q: "A square paper is folded in half twice and one hole is punched through all layers. How many holes when opened?", a: "4 holes, one in each quarter." },
    ],
    traps: ["Always check that the counts add up to the total number of small cubes.", "In folding questions, mirror across the fold line, not across the centre of the page."],
  },
];
