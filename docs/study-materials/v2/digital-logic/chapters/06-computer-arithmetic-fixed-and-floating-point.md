# Review input: Digital Logic, chapter 06: Computer arithmetic: fixed and floating point

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-06-computer-arithmetic-fixed-and-floating-point.md` and `gemini-06-computer-arithmetic-fixed-and-floating-point.md` in this folder.

*Note: chapters are matched to PYQs by the words in their titles, so a question can appear in more than one chapter. Say which chapter it really belongs to.*

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

This is **one chapter** (6 of 6) of the Digital Logic book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

In addition to Parts 1 to 4 of the instructions above, answer these chapter-specific parts:

PART 5. THE FULL LESSON PLAN FOR THIS CHAPTER
 Propose the complete list of lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with a reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind + what it shows); hand traces; common mistakes.

PART 6. THE PYQs BELOW
 For EACH previous-year question listed below: (a) which lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree, show the working and say "FACT-DOUBT"), (e) whether the question text looks mis-transcribed.

PART 7. MORE QUESTIONS
 For each lesson, list the question types GATE could ask that are NOT covered by the PYQs below (give 3 ideas each, one line each).

PART 8. WHAT IS MISSING FROM THIS CHAPTER'S SCOPE
 Topics GATE has asked (or could ask) about this chapter that the draft chapter list does not cover.
```

---

## PART B. THE CHAPTER

## Chapter details

Existing chapter in the app: **Computer arithmetic: fixed and floating point**. Not written yet.



## The PYQs for this chapter (26)

**2026_FN_Q22** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Consider the 8-bit signed integers \( X, Y \) and \( Z \) represented using the sign-magnitude form. The binary representations of \( X \) and \( Y \) are as follows:
\( X : 10110100 \quad Y : 01001100 \)
Which of the following operations to compute \( Z \) result(s) in an arithmetic overflow?

- A) \( Z = X + Y \)
- B) \( Z = X - Y \)  ✔ official
- C) \( Z = -X + Y \)  ✔ official
- D) \( Z = -X - Y \)

---

**2026_AN_Q28** · 2026-AN · MSQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

In a system, numbers are represented using 4-bit two's complement form. Consider four numbers \( N1 = 1011, N2 = 1101, N3 = 1010 \) and \( N4 = 1001 \) in the system.
Which of the following operations will result in arithmetic overflow?

- A) \( N1 + N2 \)
- B) \( N2 + N3 \)  ✔ official
- C) \( N3 - N4 \)
- D) \( N1 + N4 \)  ✔ official

---

**2026_AN_Q34** · 2026-AN · NAT · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

The 32-bit IEEE 754 single precision representation of a number is 0xC2710000. The number in decimal representation is ________. (rounded off to two decimal places)

Official answer (numeric): -60.25 to -60.25

---

**2026_FN_Q36** · 2026-FN · MCQ · 2 marks · Hard · bank topic: Number Representations & Fixed/Floating Point Math

Consider the real valued variables \( X, Y \) and \( Z \) represented using the IEEE 754 single-precision floating-point format. The binary representations of \( X \) and \( Y \) in hexadecimal notation are as follows:
\( X : \text{35C00000} \quad Y : \text{34A00000} \)
Let \( Z = X + Y \).
Which one of the following is the binary representation of \( Z \), in hexadecimal notation?

- A) 35C80000
- B) 35CC0000
- C) 35E80000  ✔ official
- D) 35EC0000

---

**2025_FN_Q25** · 2025-FN · MSQ · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

The number -6 can be represented as 1010 in 4-bit 2's complement representation. Which of the following is/are CORRECT 2's complement representation(s) of -6?

- A) 1000 1010 in 8-bits
- B) 1111 1010 in 8-bits  ✔ official
- C) 1000 0000 0000 1010 in 16-bits
- D) 1111 1111 1111 1010 in 16-bits  ✔ official

---

**2025_AN_Q49** · 2025-AN · MSQ · 2 marks · Hard · bank topic: Number Representations & Fixed/Floating Point Math

Three floating point numbers \( X, Y, \) and \( Z \) are stored in three registers \( R_X, R_Y, \) and \( R_Z \), respectively in IEEE 754 single precision format as given below in hexadecimal:
\( R_X = \text{0xC1100000}, R_Y = \text{0x40C00000}, \) and \( R_Z = \text{0x41400000} \)
Which of the following option(s) is/are CORRECT?

- A) \( 4(X + Y) + Z = 0 \)  ✔ official
- B) \( 2Y - Z = 0 \)  ✔ official
- C) \( 4X + 3Z = 0 \)  ✔ official
- D) \( X + Y + Z = 0 \)

---

**2024_FN_Q18** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Consider a system that uses 5 bits for representing signed integers in 2's complement format. In this system, two integers \( A \) and \( B \) are represented as \( A = 01010 \) and \( B = 11010 \). Which one of the following operations will result in either an arithmetic overflow or an arithmetic underflow?

- A) \( A + B \)
- B) \( A - B \)  ✔ official
- C) \( B - A \)
- D) \( 2 * B \)

---

**2024_AN_Q23** · 2024-AN · MCQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math · HAS A FIGURE (not shown here)

The format of a single-precision floating-point number as per the IEEE 754 standard is:
[IMAGE_Q_23_1]
Choose the largest floating-point number among the following options.

- A) [IMAGE_Q_23_A]
- B) [IMAGE_Q_23_C]  ✔ official
- C) [IMAGE_Q_23_D]
- D) [IMAGE_Q_23_B]

---

**2024_AN_Q60** · 2024-AN · MSQ · 2 marks · Easy · bank topic: Number Representations & Fixed/Floating Point Math

Which of the following is/are EQUAL to 224 in radix-5 (i.e. base-5) notation?

- A) 64 in radix-10  ✔ official
- B) 100 in radix-8  ✔ official
- C) 50 in radix-16
- D) 121 in radix-7  ✔ official

---

**2023_FN_Q32** · 2023-FN · NAT · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

A particular number is written as 132 in radix-4 representation. The same number in radix-5 representation is ________.

Official answer (numeric): 110 to 110

---

**2023_FN_Q45** · 2023-FN · MCQ · 2 marks · Hard · bank topic: Number Representations & Fixed/Floating Point Math

Consider the IEEE-754 single precision floating point numbers
\( P = \text{0xC1800000} \) and \( Q = \text{0x3F5C2EF4} \).
Which one of the following corresponds to the product of these numbers (i.e., \( P \times Q \)), represented in the IEEE-754 single precision format?

- A) 0x404C2EF4
- B) 0x405C2EF4
- C) 0xC15C2EF4  ✔ official
- D) 0xC14C2EF4

---

**2022_FN_Q18** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Let R1 and R2 be two 4-bit registers that store numbers in 2’s complement form. For the operation R1 + R2, which one of the following values of R1 and R2 gives an arithmetic overflow?

- A) R1 = 1011 and R2 = 1110
- B) R1 = 1100 and R2 = 1010  ✔ official
- C) R1 = 0011 and R2 = 0100
- D) R1 = 1001 and R2 = 1111

---

**2022_FN_Q41** · 2022-FN · MCQ · 2 marks · Hard · bank topic: Number Representations & Fixed/Floating Point Math · HAS A FIGURE (not shown here)

Consider three floating point numbers \(A\), \(B\) and \(C\) stored in registers \(R_A\), \(R_B\) and \(R_C\), respectively as per IEEE-754 single precision floating point format. The 32-bit content stored in these registers (in hexadecimal form) are as follows.

[IMAGE_Q_41]

Which one of the following is FALSE?

- A) \(A + C = 0\)
- B) \(C = A + B\)  ✔ official
- C) \(B = 3C\)
- D) \((B - C) > 0\)

---

**2021_AN_Q17** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math · HAS A FIGURE (not shown here)

The format of the single-precision floating-point representation of a real number as per the IEEE 754 standard is as follows:

[IMAGE_Q_17_1]

Which one of the following choices is correct with respect to the smallest normalized positive number represented using the standard?

- A) exponent = 00000001 and mantissa = 00000000000000000000000
- B) exponent = 00000000 and mantissa = 00000000000000000000001
- C) exponent = 00000000 and mantissa = 00000000000000000000000  ✔ official
- D) exponent = 00000001 and mantissa = 00000000000000000000001

---

**2021_FN_Q44** · 2021-FN · MCQ · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

Let the representation of a number in base 3 be 210. What is the hexadecimal representation of the number?

- A) 15  ✔ official
- B) 21
- C) D2
- D) 528

---

**2021_AN_Q36** · 2021-AN · NAT · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

If \(x\) and \(y\) are two decimal digits and \((0.1101)_2 = (0.8xy5)_{10}\), the decimal value of \(x + y\) is _________.

Official answer (numeric): 3 to 3

---

**2021_FN_Q65** · 2021-FN · NAT · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Consider the following representation of a number in IEEE 754 single-precision floating point format with a bias of 127.
S : 1    E : 10000001    F : 11110000000000000000000
Here S, E and F denote the sign, exponent and fraction components of the floating point representation.
The decimal value corresponding to the above representation (rounded to 2 decimal places) is _________.

Official answer (numeric): -7.75 to -7.75

---

**2020_FN_Q59** · 2020-FN · MCQ · 2 marks · Hard · bank topic: Number Representations & Fixed/Floating Point Math

Consider three registers R1, R2, and R3 that store numbers in IEEE-754 single precision floating point format. Assume that R1 and R2 contain the values (in hexadecimal notation) 0x42200000 and 0xC1200000, respectively.
If R3 = R1 / R2, what is the value stored in R3?

- A) 0x40800000
- B) 0xC0800000  ✔ official
- C) 0x83400000
- D) 0xC8500000

---

**2019_FN_Q17** · 2019-FN · MCQ · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

In 16-bit 2’s complement representation, the decimal number –28 is:

- A) 1111 1111 0001 1100
- B) 0000 0000 1110 0100
- C) 1111 1111 1110 0100  ✔ official
- D) 1000 0000 1110 0100

---

**2019_FN_Q33** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Consider Z = X – Y, where X, Y and Z are all in sign-magnitude form. X and Y are each represented in \( n \) bits. To avoid overflow, the representation of Z would require a minimum of:

- A) \( n \) bits
- B) \( n - 1 \) bits
- C) \( n + 1 \) bits  ✔ official
- D) \( n + 2 \) bits

---

**2018_FN_Q43** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Consider the unsigned 8-bit fixed point binary number representation below,
\(b_7 b_6 b_5 b_4 b_3 . b_2 b_1 b_0\)
where the position of the binary point is between \(b_3\) and \(b_2\). Assume \(b_7\) is the most significant bit. Some of the decimal numbers listed below cannot be represented exactly in the above representation:
(i) 31.500
(ii) 0.875
(iii) 12.100
(iv) 3.001
Which one of the following statements is true?

- A) None of (i), (ii), (iii), (iv) can be exactly represented
- B) Only (ii) cannot be exactly represented
- C) Only (iii) and (iv) cannot be exactly represented  ✔ official
- D) Only (i) and (ii) cannot be exactly represented

---

**2017_AN_Q23** · 2017-AN · MCQ · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

The representation of the value of a 16-bit unsigned integer X in hexadecimal number system is BCA9. The representation of the value of X in octal number system is

- A) 571244
- B) 736251
- C) 571247
- D) 136251  ✔ official

---

**2017_FN_Q24** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

The \(n\)-bit fixed-point representation of an unsigned real number \(X\) uses \(f\) bits for the fraction part. Let \(i = n - f\). The range of decimal values for \(X\) in this representation is

- A) \(2^{-f}\) to \(2^i\)
- B) \(2^{-f}\) to \((2^i - 2^{-f})\)
- C) \(0\) to \(2^i\)
- D) \(0\) to \((2^i - 2^{-f})\)  ✔ official

---

**2017_FN_Q11** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

When two 8-bit numbers \(A_7 \dots A_0\) and \(B_7 \dots B_0\) in 2's complement representation (with \(A_0\) and \(B_0\) as the least significant bits) are added using a ripple-carry adder, the sum bits obtained are \(S_7 \dots S_0\) and the carry bits are \(C_7 \dots C_0\). An overflow is said to have occurred if

- A) the carry bit \(C_7\) is 1
- B) all the carry bits (\(C_7 \dots C_0\)) are 1
- C) \(\left(A_7 \cdot B_7 \cdot \bar{S}_7 + \bar{A}_7 \cdot \bar{B}_7 \cdot S_7\right)\) is 1  ✔ official
- D) \(\left(A_0 \cdot B_0 \cdot \bar{S}_0 + \bar{A}_0 \cdot \bar{B}_0 \cdot S_0\right)\) is 1

---

**2017_AN_Q12** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Given the following binary number in 32-bit (single precision) IEEE-754 format:
00111110011011010000000000000000
The decimal value closest to this floating-point number is

- A) \(1.45 \times 10^1\)
- B) \(1.45 \times 10^{-1}\)
- C) \(2.27 \times 10^{-1}\)  ✔ official
- D) \(2.27 \times 10^1\)

---

**2017_AN_Q25** · 2017-AN · NAT · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Consider a quadratic equation \(x^2 - 13x + 36 = 0\) with coefficients in a base '\(b\)'. The solutions of this equation in the same base '\(b\)' are \(x = 5\) and \(x = 6\). Then \(b = \) ________.

Official answer (numeric): 8.0 to 8.0

