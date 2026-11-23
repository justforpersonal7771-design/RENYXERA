# In-depth review input: Verbal Aptitude

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-verbal-aptitude.md` and `gemini-review-verbal-aptitude.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 33 PYQs with full text and the official key (C).

---

## PART A. REVIEWER INSTRUCTIONS

```
YOU ARE NOT AN EXPERT. YOU ARE THIS STUDENT:
You are 25 years old. You sat at the back of the class. You failed GATE twice and have plenty of backlogs. You studied
Programming and Data Structures (and the other subjects) in college only to pass, copied the assignments, and
remember almost nothing. You are ashamed of that, you do not want to ask, and you are now preparing again with
about 100 days left. You have read Made Easy notes, Unacademy PDFs and GateWallah books and they left you confused:
they use words they never explain, jump steps and show few pictures. You will only believe a book that is teaching
you from the very beginning.

I will give you a document. Read it as this student. Do NOT be polite and do NOT be an expert reviewer who nods.
Stop at every place where this student would get stuck. Then answer in the four parts below.

PART 1. FEELINGS (10 lines)
 How did you feel reading it? Where did you feel lost, bored, scared, or tricked? Where did you feel "I can do this"?
 Would you pay Rs 149 per subject book for this? Yes or no, and the real reason.

PART 2. GAP TABLE (the main part; at least 40 rows if the document is a plan, 15 if it is one topic)
 | # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
 Type is one of: MISSING-PREREQUISITE, UNEXPLAINED-WORD, STEP-SKIPPED, NEEDS-DIAGRAM, NEEDS-EXAMPLE, NEEDS-TRACE,
 MISSING-GATE-CONCEPT, MISSING-FINER-POINT, WRONG-ORDER, TOO-HARD-TOO-EARLY, TOO-LONG-BORING, UNCLEAR-ENGLISH, FACT-DOUBT.
 Priority is HIGH / MEDIUM / LOW.

PART 3. WHAT A COMPLETE SUBJECT MUST HAVE
 From your knowledge of GATE (previous-year papers, Made Easy, Unacademy, GateWallah, standard university textbooks,
 NPTEL), list every chapter, topic and finer sub-topic that this subject has but the document does NOT cover, with:
 the syllabus line it serves, how often GATE asks it (if you really know; otherwise say "not sure"), the typical
 question type, and the prerequisite a zero-level student needs first.

PART 4. THE DIAGRAMS I NEED
 List every diagram this student needs to SEE in order to understand each chapter. For each: what to draw, what the
 student should notice, and whether it should be a single picture, a step-by-step series of pictures, or a trace table.

RULES FOR YOU
 - Do not invent GATE years, question numbers or statistics. If you are not sure, write "not sure".
 - Do not just praise. If you find fewer than 40 problems in a long plan, you read too fast; read again.
 - Say it in simple English.
 - If a fact in the document looks wrong, say exactly which and why (FACT-DOUBT).

This is the **in-depth review of the whole Verbal Aptitude book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **88 rows** in the gap table in Part 2 (spread across every chapter).

If your reply gets too long, **stop at the end of a chapter** and write "CONTINUE FROM CHAPTER <number>". I will answer "continue" and you carry on. Do not shorten later chapters to fit; every chapter gets the same depth.

In addition to Parts 1 to 4 above, answer these parts:

PART 5. THE FULL PLAN, CHAPTER BY CHAPTER
 For every chapter (the ones given below, plus any you think are missing), list the lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with the reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind and what it shows); hand traces; common mistakes.

PART 6. EVERY PYQ LISTED BELOW
 For EACH previous-year question: (a) the chapter and lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree show the working and write FACT-DOUBT), (e) whether the question text looks mis-transcribed (say exactly what).

PART 7. MORE QUESTIONS NEEDED
 For each lesson, three question ideas GATE could ask that the PYQs do not cover (one line each, with the type MCQ / MSQ / NAT).

PART 8. WHAT IS MISSING FROM THE SUBJECT
 Topics GATE has asked, or could ask, that no chapter below covers.

PART 9. WEIGHTS
 Give each chapter a weight tag (High / Medium / Low / Foundation) and say whether the one derived from the bank (below) looks fair. Do not invent frequencies; write "not sure".
```

---

## PART B. THE CONTENTS TO REVIEW


Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Basic English grammar: tenses, articles, adjectives, prepositions, conjunctions, verb-noun agreement.
- Basic vocabulary: words, idioms, phrases in context.
- Reading and comprehension.
- Narrative sequencing.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Articles and determiners | none | not written |
| 02 | Adjectives and adverbs | none | not written |
| 03 | Prepositions | none | not written |
| 04 | Conjunctions | none | not written |
| 05 | Subject–verb agreement | none | not written |
| 06 | Tenses and other parts of speech | none | not written |
| 07 | Vocabulary: words in context | none | not written |
| 08 | Idioms and phrases | none | not written |
| 09 | Reading comprehension | none | not written |
| 10 | Narrative sequencing | none | not written |
| 11 | Sentence completion | none | not written |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **33**; marks: **45** = **3.0%** of all 1500 marks (about 3.0 marks a paper).
- Forge (our own) questions for this subject: **28**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Reading Comprehension | 10 | 19 | 1.27% | 7 | 0/10/0 | MCQ2×9, MCQ1×1 |
| Basic Vocabulary (Words, Idioms, Phrases in Context) | 9 | 10 | 0.67% | 7 | 9/0/0 | MCQ1×8, MCQ2×1 |
| Grammar Rules (Prepositions, Conjunctions, Verb-Noun Agreement, Other Parts of Speech) | 5 | 5 | 0.33% | 4 | 5/0/0 | MCQ1×5 |
| Vocabulary Mechanics (Antonyms, Synonyms) | 4 | 4 | 0.27% | 3 | 4/0/0 | MCQ1×4 |
| Narrative Sequencing | 2 | 4 | 0.27% | 2 | 0/2/0 | MCQ2×2 |
| Basic English Grammar (Tenses, Articles, Adjectives) | 3 | 3 | 0.20% | 2 | 3/0/0 | MCQ1×3 |


---

## PART C. ALL 33 PREVIOUS-YEAR QUESTIONS (Verbal Aptitude)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_FN_Q1** · 2026-FN · MCQ · 1 mark · Easy · bank topic: Vocabulary Mechanics (Antonyms, Synonyms)

The antonym of the word protagonist is ________.

- A) agnostic
- B) antagonist  ✔ official
- C) arsonist
- D) anarchist

---

**2026_AN_Q1** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Vocabulary Mechanics (Antonyms, Synonyms)

Expedite, Hasten, Hurry, ________.
Fill the blank by choosing a word with a meaning similar to that of the words given above.

- A) Accelerate  ✔ official
- B) Retard
- C) Provide
- D) Disable

---

**2026_FN_Q6** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

Combinatorics deals with problems involving counting. For example, “How many distinct arrangements of N distinct objects in M spaces on a circle are possible?” is a typical problem in combinatorics. This kind of counting is sometimes used in the modeling of several physical phenomena. Often, in such models, the different combinatorial possibilities are assigned probability values. Assigning probabilities enables the computation of the average values of physical quantities.
Consider the following statements:
P : Combinatorics is always invoked in the modeling of physical phenomena.
Q : Modeling some physical phenomena involves assigning probabilities to combinatorial possibilities in order to compute average values of physical quantities.
Based on the passage above, what can be inferred about statements P and Q?

- A) P is False and Q is False
- B) P is False and Q is True  ✔ official
- C) P is True and Q is False
- D) P is True and Q is True

---

**2025_FN_Q1** · 2025-FN · MCQ · 1 mark · Easy · bank topic: Basic English Grammar (Tenses, Articles, Adjectives)

Ravi had ________ younger brother who taught at ________ university. He was widely regarded as ________ honorable man.
Select the option with the correct sequence of articles to fill in the blanks.

- A) a; a; an  ✔ official
- B) the; an; a
- C) a; an; a
- D) an; an; a

---

**2025_AN_Q1** · 2025-AN · MCQ · 1 mark · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

Despite his initial hesitation, Rehman's ________ to contribute to the success of the project never wavered.
Select the most appropriate option to complete the above sentence.

- A) ambivalence
- B) satisfaction
- C) resolve  ✔ official
- D) revolve

---

**2025_FN_Q2** · 2025-FN · MCQ · 1 mark · Easy · bank topic: Vocabulary Mechanics (Antonyms, Synonyms)

The CEO’s decision to downsize the workforce was considered myopic because it sacrificed long-term stability to accommodate short-term gains.
Select the most appropriate option that can replace the word “myopic” without changing the meaning of the sentence.

- A) visionary
- B) shortsighted  ✔ official
- C) progressive
- D) innovative

---

**2025_FN_Q6** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

“I put the brown paper in my pocket along with the chalks, and possibly other things. I suppose every one must have reflected how primeval and how poetical are the things that one carries in one’s pocket: the pocket-knife, for instance the type of all human tools, the infant of the sword. Once I planned to write a book of poems entirely about the things in my pocket. But I found it would be too long: and the age of the great epics is past.”
(From G.K. Chesterton’s “A Piece of Chalk”)
Based only on the information provided in the above passage, which one of the following statements is true?

- A) The author of the passage carries a mirror in his pocket to reflect upon things.
- B) The author of the passage had decided to write a poem on epics.
- C) The pocket-knife is described as the infant of the sword.  ✔ official
- D) Epics are described as too inconvenient to write.

---

**2024_AN_Q1** · 2024-AN · MCQ · 1 mark · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

If ‘\(\rightarrow\)’ denotes increasing order of intensity, then the meaning of the words [walk \(\rightarrow\) jog \(\rightarrow\) sprint] is analogous to [bothered \(\rightarrow\) ________ \(\rightarrow\) daunted].
Which one of the given options is appropriate to fill the blank?

- A) phased
- B) phrased
- C) fazed  ✔ official
- D) fused

---

**2024_FN_Q3** · 2024-FN · MCQ · 2 marks · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

In the given text, the blanks are numbered (i) - (iv). Select the best match for all the blanks.
Steve was advised to keep his head ____(i)____ before heading ____(ii)____ to bat; for, while he had a head ____(iii)____ batting, he could only do so with a cool head ____(iv)____ his shoulders.

- A) (i) down (ii) down (iii) on (iv) for
- B) (i) on (ii) down (iii) for (iv) on
- C) (i) down (ii) out (iii) for (iv) on  ✔ official
- D) (i) on (ii) out (iii) on (iv) for

---

**2024_AN_Q7** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Narrative Sequencing

Sequence the following sentences in a coherent passage.
P : This fortuitous geological event generated a colossal amount of energy and heat that resulted in the rocks rising to an average height of 4 km across the contact zone.
Q : Thus, the geophysicists tend to think of the Himalayas as an active geological event rather than as a static geological feature.
R : The natural process of the cooling of this massive edifice absorbed large quantities of atmospheric carbon dioxide, altering the earth's atmosphere and making it better suited for life.
S : Many millennia ago, a breakaway chunk of bedrock from the Antarctic Plate collided with the massive Eurasian Plate.

- A) QPSR
- B) QSPR
- C) SPRQ  ✔ official
- D) SRPQ

---

**2023_FN_Q1** · 2023-FN · MCQ · 1 mark · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

We reached the station late, and ________ missed the train.

- A) near
- B) nearly  ✔ official
- C) utterly
- D) mostly

---

**2023_FN_Q8** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Narrative Sequencing

Which one of the following sentence sequences creates a coherent narrative?
(i) Once on the terrace, on her way to her small room in the corner, she notices the man right away.
(ii) She begins to pant by the time she has climbed all the stairs.
(iii) Mina has bought vegetables and rice at the market, so her bags are heavy.
(iv) He was leaning against the parapet, watching the traffic below.

- A) (i), (ii), (iv), (iii)
- B) (ii), (iii), (i), (iv)
- C) (iv), (ii), (i), (iii)
- D) (iii), (ii), (i), (iv)  ✔ official

---

**2022_FN_Q1** · 2022-FN · MCQ · 1 mark · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

The _________ is too high for it to be considered _________.

- A) fair / fare
- B) faer / fair
- C) fare / fare
- D) fare / fair  ✔ official

---

**2022_FN_Q6** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

Some people believe that “what gets measured, improves”. Some others believe that “what gets measured, gets gamed”. One possible reason for the difference in the beliefs is the work culture in organizations. In organizations with good work culture, metrics help improve outcomes. However, the same metrics are counterproductive in organizations with poor work culture.
Which one of the following is the CORRECT logical inference based on the information in the above passage?

- A) Metrics are useful in organizations with poor work culture.
- B) Metrics are useful in organizations with good work culture.  ✔ official
- C) Metrics are always counterproductive in organizations with good work culture.
- D) Metrics are never useful in organizations with good work culture.

---

**2021_AN_Q4** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Grammar Rules (Prepositions, Conjunctions, Verb-Noun Agreement, Other Parts of Speech)

Gauri said that she can play keyboard ________ her sister.

- A) as well as  ✔ official
- B) as better as
- C) as nicest as
- D) as worse as

---

**2021_FN_Q5** · 2021-FN · MCQ · 1 mark · Easy · bank topic: Grammar Rules (Prepositions, Conjunctions, Verb-Noun Agreement, Other Parts of Speech)

Consider the following sentences:
(i) Everybody in the class is prepared for the exam.
(ii) Babu invited Danish to his home because he enjoys playing chess.
Which of the following is the CORRECT observation about the above two sentences?

- A) (i) is grammatically correct and (ii) is unambiguous
- B) (i) is grammatically incorrect and (ii) is unambiguous
- C) (i) is grammatically correct and (ii) is ambiguous  ✔ official
- D) (i) is grammatically incorrect and (ii) is ambiguous

---

**2021_AN_Q2** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

Listening to music during exercise improves exercise performance and reduces discomfort. Scientists researched whether listening to music while studying can help students learn better and the results were inconclusive. Students who needed external stimulation for studying fared worse while students who did not need any external stimulation benefited from music.
Which one of the following statements is the CORRECT inference of the above passage?

- A) Listening to music has no effect on learning and a positive effect on physical exercise.
- B) Listening to music has a clear positive effect both on physical exercise and on learning.
- C) Listening to music has a clear positive effect on physical exercise. Music has a positive effect on learning only in some students.  ✔ official
- D) Listening to music has a clear positive effect on learning in all students. Music has a positive effect only in some students who exercise.

---

**2021_FN_Q6** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

Some people suggest anti-obesity measures (AOM) such as displaying calorie information in restaurant menus. Such measures sidestep addressing the core problems that cause obesity: poverty and income inequality.
Which one of the following statements summarizes the passage?

- A) The proposed AOM addresses the core problems that cause obesity.
- B) If obesity reduces, poverty will naturally reduce, since obesity causes poverty.
- C) AOM are addressing the core problems and are likely to succeed.
- D) AOM are addressing the problem superficially.  ✔ official

---

**2020_FN_Q2** · 2020-FN · MCQ · 1 mark · Easy · bank topic: Grammar Rules (Prepositions, Conjunctions, Verb-Noun Agreement, Other Parts of Speech)

Raman is confident of speaking English ________ six months as he has been practising regularly ________ the last three weeks.

- A) during, for
- B) for, since
- C) for, in
- D) within, for  ✔ official

---

**2020_FN_Q7** · 2020-FN · MCQ · 1 mark · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

His knowledge of the subject was excellent but his classroom performance was ________.

- A) extremely poor  ✔ official
- B) good
- C) desirable
- D) praiseworthy

---

**2020_FN_Q9** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Reading Comprehension

The dawn of the 21st century witnessed the melting glaciers oscillating between giving too much and too little to billions of people who depend on them for fresh water. The UN climate report estimates that without deep cuts to man-made emissions, at least 30% of the northern hemisphere's surface permafrost could melt by the end of the century. Given this situation of imminent global exodus of billions of people displaced by rising seas, nation-states need to rethink their carbon footprint for political concerns, if not for environmental ones.
Which one of the following statements can be inferred from the given passage?

- A) Nation-states do not have environmental concerns.
- B) Nation-states are responsible for providing fresh water to billions of people.
- C) Billions of people are responsible for man-made emissions.
- D) Billions of people are affected by melting glaciers.  ✔ official

---

**2020_FN_Q1** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

Goods and Services Tax (GST) is an indirect tax introduced in India in 2017 that is imposed on the supply of goods and services, and it subsumes all indirect taxes except few. It is a destination-based tax imposed on goods and services used, and it is not imposed at the point of origin from where goods come. GST also has a few components specific to state governments, central government and Union Territories (UTs).
Which one of the following statements can be inferred from the given passage?

- A) GST is imposed on the production of goods and services.
- B) GST includes all indirect taxes.
- C) GST does not have a component specific to UT.
- D) GST is imposed at the point of usage of goods and services.  ✔ official

---

**2019_FN_Q2** · 2019-FN · MCQ · 1 mark · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

The expenditure on the project ________ as follows; equipments Rs. 20 lakhs, salaries Rs. 12 lakhs, and contingency Rs.3 lakhs.

- A) break down
- B) break
- C) breaks down  ✔ official
- D) breaks

---

**2019_FN_Q5** · 2019-FN · MCQ · 1 mark · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

The search engine’s business model ________ around the fulcrum of trust.

- A) revolves  ✔ official
- B) plays
- C) sinks
- D) bursts

---

**2019_FN_Q10** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

“A recent High Court judgement has sought to dispel the idea of begging as a disease — which leads to its stigmatization and criminalization — and to regard it as a symptom. The underlying disease is the failure of the state to protect citizens who fall through the social security net”.
Which one of the following statements can be inferred from the given passage?

- A) Beggars are lazy people who beg because they are unwilling to work
- B) Beggars are created because of the lack of social welfare schemes  ✔ official
- C) Begging is an offence that has to be dealt with firmly
- D) Begging has to be banned because it adversely affects the welfare of the state

---

**2018_FN_Q01** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Grammar Rules (Prepositions, Conjunctions, Verb-Noun Agreement, Other Parts of Speech)

“From where are they bringing their books? ________ bringing _______ books from _____.”
The words that best fill the blanks in the above sentence are

- A) Their, they’re, there
- B) They’re, their, there  ✔ official
- C) There, their, they’re
- D) They’re, there, there

---

**2018_FN_Q02** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Basic Vocabulary (Words, Idioms, Phrases in Context)

“A _________ investigation can sometimes yield new facts, but typically organized ones are more successful.”
The word that best fills the blank in the above sentence is

- A) meandering  ✔ official
- B) timely
- C) consistent
- D) systematic

---

**2017_FN_Q03** · 2017-FN · MCQ · 1 mark · Easy · bank topic: Basic English Grammar (Tenses, Articles, Adjectives)

After Rajendra Chola returned from his voyage to Indonesia, he ________ to visit the temple in Thanjavur.

- A) was wishing
- B) is wishing
- C) wished  ✔ official
- D) had wished

---

**2017_AN_Q04** · 2017-AN · MCQ · 1 mark · Easy · bank topic: Vocabulary Mechanics (Antonyms, Synonyms)

Choose the option with words that are not synonyms.

- A) aversion, dislike
- B) luminous, radiant
- C) plunder, loot
- D) yielding, resistant  ✔ official

---

**2017_FN_Q04** · 2017-FN · MCQ · 1 mark · Easy · bank topic: Grammar Rules (Prepositions, Conjunctions, Verb-Noun Agreement, Other Parts of Speech)

Research in the workplace reveals that people work for many reasons _________.

- A) money beside
- B) beside money
- C) money besides
- D) besides money  ✔ official

---

**2017_AN_Q03** · 2017-AN · MCQ · 1 mark · Easy · bank topic: Basic English Grammar (Tenses, Articles, Adjectives)

Saturn is ________ to be seen on a clear night with the naked eye.

- A) enough bright
- B) bright enough  ✔ official
- C) as enough bright
- D) bright as enough

---

**2017_FN_Q06** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

"The hold of the nationalist imagination on our colonial past is such that anything inadequately or improperly nationalist is just not history."
Which of the following statements best reflects the author's opinion?

- A) Nationalists are highly imaginative
- B) History is viewed through the filter of nationalism  ✔ official
- C) Our colonial past never happened
- D) Nationalism has to be both adequately and properly imagined.

---

**2017_AN_Q08** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Reading Comprehension

"We lived in a culture that denied any merit to literary works, considering them important only when they were handmaidens to something seemingly more urgent- namely ideology. This was a country where all gestures, even the most private, were interpreted in political terms."
The author's belief that ideology is not as important as literature is revealed by the word:

- A) 'culture'
- B) 'seemingly'  ✔ official
- C) 'urgent'
- D) 'political'

