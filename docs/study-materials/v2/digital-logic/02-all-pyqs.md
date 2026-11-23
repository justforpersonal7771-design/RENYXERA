# Digital Logic: every PYQ in the bank (69 questions)

Full text with options. "✔ official" marks the official key. Figures are not included (the question says so).

---

**2026_AN_Q16** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Boolean Algebra, Minimization, K-Maps

Which one of the following options is **not** a property of Boolean Algebra?
**Note:** + is OR operation, \( \cdot \) is AND operation, and ' is NOT operation

- A) \( a + b = b + a \)
- B) \( a \cdot a' = 1 \)  ✔ official
- C) \( a + a' = 1 \)
- D) \( a \cdot b = b \cdot a \)

---

**2026_FN_Q21** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the following Boolean expression of a function \( F \):
$$ F(P, Q) = (P + Q) \oplus (\overline{P}Q) $$
Which of the following expressions is/are equivalent to \( F \)?

- A) \( \overline{P \oplus Q} \)  ✔ official
- B) \( P \oplus Q \)
- C) \( P \oplus \overline{Q} \)  ✔ official
- D) \( \overline{P} \oplus \overline{Q} \)

---

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

**2026_FN_Q37** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a 2-bit saturating up/down counter that performs the saturating up count when the input \( P \) is 0, and the saturating down count when \( P \) is 1. The Next State table of the counter is as shown. The counter is built as a synchronous sequential circuit using \( D \) flip-flops.
[IMAGE_Q_37_1]
Which one of the following options corresponds to the expressions for the inputs of the \( D \) flip-flops, \( D_1 \) and \( D_0 \)?

- A) \( D_1 = PQ_1 + \overline{P}Q_0 + Q_1Q_0 \quad D_0 = PQ_0 + \overline{P}Q_1 + Q_1\overline{Q_0} \)
- B) \( D_1 = \overline{P}Q_1 + \overline{P}Q_0 + Q_1Q_0 \quad D_0 = \overline{P}\overline{Q_0} + \overline{P}Q_1 + Q_1\overline{Q_0} \)  ✔ official
- C) \( D_1 = P\overline{Q_1} + P\overline{Q_0} + Q_1Q_0 \quad D_0 = PQ_0 + \overline{P}Q_1 + Q_1Q_0 \)
- D) \( D_1 = P\overline{Q_1} + \overline{P}Q_0 + Q_1Q_0 \quad D_0 = P\overline{Q_0} + \overline{P}Q_1 + Q_1\overline{Q_0} \)

---

**2026_AN_Q40** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the following 4-variable Boolean function
\( F(A, B, C, D) = \Sigma m(0, 1, 2, 3, 8, 9, 10, 11) \)
Consider \( A \) as MSB, \( D \) as LSB. Which one of the following options represents the minimal sum of products form for the above function?
Note: + is OR operation, \( \cdot \) is AND operation, ' is NOT operation

- A) \( A' + B' + C' + D' \)
- B) \( B' \)  ✔ official
- C) \( A' \cdot B' + A \cdot B \)
- D) \( A' \)

---

**2026_FN_Q48** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider a Boolean function \( F \) with the following minterm expression:
$$ F(P, Q, R, S) = \Sigma m(1, 2, 3, 4, 5, 7, 10, 12, 13, 14) $$
Which of the following options is/are the minimal sum-of-products expression(s) of \( F \)?

- A) \( \overline{P}S + Q\overline{R} + \overline{P}\overline{Q}R + \overline{Q}R\overline{S} \)
- B) \( \overline{P}S + Q\overline{R} + \overline{P}\overline{Q}R + PR\overline{S} \)  ✔ official
- C) \( \overline{P}S + Q\overline{R} + PQ\overline{S} + PR\overline{S} \)
- D) \( \overline{P}S + Q\overline{R} + PQ\overline{S} + \overline{Q}R\overline{S} \)  ✔ official

---

**2026_AN_Q59** · 2026-AN · NAT · 2 marks · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

Consider the digital circuit shown below with two input lines A and B, two select lines S0 and S1, and an output line Y. The blocks Q and M represent active high 2 : 4 decoder and 4-to-1 multiplexer, respectively. Out of 16 possible input combinations, the number of combinations that produce Y = 1 is ________. (answer in integer)
Note: One input combination is an instance of [A B S1 S0].
[IMAGE_Q_59_1]

Official answer (numeric): 6 to 6

---

**2025_FN_Q24** · 2025-FN · MSQ · 1 mark · Hard · bank topic: Boolean Algebra, Minimization, K-Maps

Let \( X \) be a 3-variable Boolean function that produces output as '1' when at least two of the input variables are '1'. Which of the following statement(s) is/are CORRECT, where \( a \), \( b \), \( c \), \( d \), \( e \) are Boolean variables?

- A) \( X(a, b, X(c, d, e)) = X(X(a, b, c), d, e) \)
- B) \( X(a, b, X(a, b, c)) = X(a, b, c) \)  ✔ official
- C) \( X(a, b, X(a, c, d)) = (X(a, b, a) \text{ AND } X(c, d, c)) \)
- D) \( X(a, b, c) = X(a, X(a, b, c), X(a, c, c)) \)  ✔ official

---

**2025_FN_Q25** · 2025-FN · MSQ · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

The number -6 can be represented as 1010 in 4-bit 2's complement representation. Which of the following is/are CORRECT 2's complement representation(s) of -6?

- A) 1000 1010 in 8-bits
- B) 1111 1010 in 8-bits  ✔ official
- C) 1000 0000 0000 1010 in 16-bits
- D) 1111 1111 1111 1010 in 16-bits  ✔ official

---

**2025_AN_Q31** · 2025-AN · MSQ · 1 mark · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

Consider the following logic circuit diagram.
[IMAGE_Q_31_1]
Which is/are the CORRECT option(s) for the output function ..?

- A) \( \overline{XY} \)  ✔ official
- B) \( \overline{X} + \overline{Y} + X\overline{Y} \)  ✔ official
- C) \( \overline{XY} + \overline{X} + X\overline{Y} \)  ✔ official
- D) \( X + \overline{Y} \)

---

**2025_AN_Q34** · 2025-AN · NAT · 1 mark · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters)

In a 4-bit ripple counter, if the period of the waveform at the last flip-flop is 64 microseconds, then the frequency of the ripple counter in kHz is ________. (Answer in integer)

Official answer (numeric): 250 to 250

---

**2025_FN_Q42** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the following four variable Boolean function in sum-of-product form
$$ F(b_3, b_2, b_1, b_0) = \Sigma(0, 2, 4, 8, 10, 11, 12) $$
where the value of the function is computed by considering \( b_3b_2b_1b_0 \) as a 4-bit binary number, where \( b_3 \) denotes the most significant bit and \( b_0 \) denotes the least significant bit. Note that there are no don't care terms. Which ONE of the following options is the CORRECT minimized Boolean expression for \( F \)?

- A) \( \overline{b_1}\overline{b_0} + \overline{b_2}\overline{b_0} + b_1\overline{b_2}b_3 \)  ✔ official
- B) \( \overline{b_1}\overline{b_0} + \overline{b_2}\overline{b_0} \)
- C) \( \overline{b_2}\overline{b_0} + b_1b_2b_3 \)
- D) \( \overline{b_0}\overline{b_2} + \overline{b_3} \)

---

**2025_AN_Q43** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps · HAS A FIGURE (not shown here)

Given the following Karnaugh Map for a Boolean function \( F(w, x, y, z) \):
[IMAGE_Q_43_1]
Which one or more of the following Boolean expression(s) represent(s) \( F \)?

- A) \( \overline{w}\overline{x}y\overline{z} + w\overline{x}\overline{y}\overline{z} + w\overline{x}y\overline{z} + xz \)  ✔ official
- B) \( \overline{w}\overline{x}y\overline{z} + \overline{w}x\overline{y}\overline{z} + w\overline{x}y\overline{z} + xz \)
- C) \( w\overline{x}y\overline{z} + w\overline{x}\overline{y}\overline{z} + \overline{w}\overline{x}\overline{y}z + xz \)
- D) \( \overline{x}\overline{z} + xz \)  ✔ official

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

**2025_AN_Q50** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Which of the following Boolean algebraic equation(s) is/are CORRECT?

- A) \( \overline{A}BC + A\overline{B}\overline{C} + \overline{A}\overline{B}C + \overline{A}BC + ABC = BC + \overline{B}\overline{C} + \overline{A}B \)
- B) \( AB + \overline{A}C + BC = AB + \overline{A}C \)  ✔ official
- C) \( (A + C)(\overline{A} + B) = AB + \overline{A}C \)  ✔ official
- D) \( (A + \overline{B} + \overline{D})(C + D)(\overline{A} + C + D)(A + B + \overline{D}) = \overline{A}D + C\overline{D} \)  ✔ official

---

**2025_FN_Q59** · 2025-FN · NAT · 2 marks · Hard · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a finite state machine (FSM) with one input \( X \) and one output \( f \), represented by the given state transition table. The minimum number of states required to realize this FSM is ________. (Answer in integer)
[IMAGE_Q_59_1]

Official answer (numeric): 5 to 5

---

**2025_FN_Q60** · 2025-FN · NAT · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider the given sequential circuit designed using D-Flip-flops. The circuit is initialized with some value (initial state). The number of distinct states the circuit will go through before returning back to the initial state is ________. (Answer in integer)
[IMAGE_Q_60_1]

Official answer (numeric): 7 to 8

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

**2024_FN_Q17** · 2024-FN · MSQ · 1 mark · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

Consider the circuit shown below where the gates may have propagation delays. Assume that all signal transitions occur instantaneously and that wires have no delays. Which of the following statements about the circuit is/are CORRECT?
[IMAGE_Q_17_1]

- A) With no propagation delays, the output \( Y \) is always logic Zero  ✔ official
- B) With no propagation delays, the output \( Y \) is always logic One
- C) With propagation delays, the output \( Y \) can have a transient logic One after \( X \) transitions from logic Zero to logic One  ✔ official
- D) With propagation delays, the output \( Y \) can have a transient logic Zero after \( X \) transitions from logic One to logic Zero

---

**2024_AN_Q32** · 2024-AN · MSQ · 1 mark · Easy · bank topic: Boolean Algebra, Minimization, K-Maps

For a Boolean variable \( x \), which of the following statements is/are FALSE?

- A) \( x \cdot 1 = x \)
- B) \( x + 1 = x \)  ✔ official
- C) \( x \cdot x = 0 \)  ✔ official
- D) \( x + \overline{x} = 1 \)

---

**2024_FN_Q62** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider a Boolean expression given by \( F(X, Y, Z) = \Sigma(3, 5, 6, 7) \)
Which of the following statements is/are CORRECT?

- A) \( F(X, Y, Z) = \Pi(0, 1, 2, 4) \)  ✔ official
- B) \( F(X, Y, Z) = XY + YZ + XZ \)  ✔ official
- C) \( F(X, Y, Z) \) is independent of input \( Y \)
- D) \( F(X, Y, Z) \) is independent of input \( X \)

---

**2024_AN_Q60** · 2024-AN · MSQ · 2 marks · Easy · bank topic: Number Representations & Fixed/Floating Point Math

Which of the following is/are EQUAL to 224 in radix-5 (i.e. base-5) notation?

- A) 64 in radix-10  ✔ official
- B) 100 in radix-8  ✔ official
- C) 50 in radix-16
- D) 121 in radix-7  ✔ official

---

**2024_AN_Q46** · 2024-AN · MSQ · 2 marks · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

Consider 4-variable function \( f1, f2, f3, f4 \) expressed in sum-of-minterms form as given below:
\( f1 = \Sigma(0, 2, 3, 5, 7, 8, 11, 13) \)
\( f2 = \Sigma(1, 3, 5, 7, 11, 13, 15) \)
\( f3 = \Sigma(0, 1, 4, 11) \)
\( f4 = \Sigma(0, 2, 6, 13) \)
[IMAGE_Q_46_1]
With respect to the circuit given above, which of the following options is/are CORRECT?

- A) \( Y = \Sigma(0, 1, 2, 11, 13) \)
- B) \( Y = \Pi(3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15) \)
- C) \( Y = \Sigma(0, 1, 2, 3, 4, 5, 6, 7) \)  ✔ official
- D) \( Y = \Pi(8, 9, 10, 11, 12, 13, 14, 15) \)  ✔ official

---

**2024_FN_Q49** · 2024-FN · NAT · 2 marks · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

Consider a digital logic circuit consisting of three 2-to-1 multiplexers M1, M2, and M3 as shown below. X1 and X2 are inputs of M1. X3 and X4 are inputs of M2. \( A \), \( B \), and \( C \) are select lines of M1, M2, and M3, respectively.
[IMAGE_Q_49_1]
For an instance of inputs X1 = 1, X2 = 1, X3 = 0, and X4 = 0, the number of combinations of \( A, B, C \) that give the output Y = 1 is ________.

Official answer (numeric): 4 to 4

---

**2023_FN_Q21** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

The output of a 2-input multiplexer is connected back to one of its inputs as shown in the figure.
[IMAGE_Q_21_1]
Match the functional equivalence of this circuit to one of the following options.

- A) D Flip-flop
- B) D Latch  ✔ official
- C) Half-adder
- D) Demultiplexer

---

**2023_FN_Q32** · 2023-FN · NAT · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

A particular number is written as 132 in radix-4 representation. The same number in radix-5 representation is ________.

Official answer (numeric): 110 to 110

---

**2023_FN_Q43** · 2023-FN · MCQ · 2 marks · Hard · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a sequential digital circuit consisting of \( T \) flip-flops and \( D \) flip-flops as shown in the figure. CLKIN is the clock input to the circuit. At the beginning, Q1, Q2 and Q3 have values 0, 1 and 1, respectively.
[IMAGE_Q_43_1]
Which one of the given values of (Q1, Q2, Q3) can NEVER be obtained with this digital circuit?

- A) (0, 0, 1)  ✔ official
- B) (1, 0, 0)
- C) (1, 0, 1)
- D) (1, 1, 1)

---

**2023_FN_Q44** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

A Boolean digital circuit is composed using two 4-input multiplexers (M1 and M2) and one 2-input multiplexer (M3) as shown in the figure. X0 – X7 are the inputs of the multiplexers M1 and M2 and could be connected to either 0 or 1. The select lines of the multiplexers are connected to Boolean variables A, B and C as shown.
[IMAGE_Q_44_1]
Which one of the following set of values of (X0, X1, X2, X3, X4, X5, X6, X7) will realise the Boolean function \( A + \overline{A}\cdot\overline{C} + A\cdot\overline{B}\cdot C \)?

- A) (1, 1, 0, 0, 1, 1, 1, 0)
- B) (1, 1, 0, 0, 1, 1, 0, 1)
- C) (1, 1, 0, 1, 1, 1, 0, 0)  ✔ official
- D) (0, 0, 1, 1, 0, 1, 1, 1)

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

**2022_FN_Q40** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

Consider a digital display system (DDS) shown in the figure that displays the contents of register X. A 16-bit code word is used to load a word in X, either from S or from R. S is a 1024-word memory segment and R is a 32-word register file. Based on the value of mode bit M, T selects an input word to load in X. P and Q interface with the corresponding bits in the code word to choose the addressed word. Which one of the following represents the functionality of P, Q, and T?

[IMAGE_Q_40]

- A) P is 10 : 1 multiplexer; Q is 5 : 1 multiplexer; T is 2 : 1 multiplexer
- B) P is 10 : \(2^{10}\) decoder; Q is 5 : \(2^5\) decoder; T is 2 : 1 encoder
- C) P is 10 : \(2^{10}\) decoder; Q is 5 : \(2^5\) decoder; T is 2 : 1 multiplexer  ✔ official
- D) P is 1 : 10 de-multiplexer; Q is 1 : 5 de-multiplexer; T is 2 : 1 multiplexer

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

**2021_AN_Q56** · 2021-AN · MCQ · 1 mark · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

Which one of the following circuits implements the Boolean function given below?
\(f(x, y, z) = m_0 + m_1 + m_3 + m_4 + m_5 + m_6\), where \(m_i\) is the \(i^{\text{th}}\) minterm.

- A) [IMAGE_Q_56_D]  ✔ official
- B) [IMAGE_Q_56_A]
- C) [IMAGE_Q_56_C]
- D) [IMAGE_Q_56_B]

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

**2021_FN_Q55** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a 3-bit counter, designed using T flip-flops, as shown below:

[IMAGE_Q_55_1]

Assuming the initial state of the counter given by \(PQR\) as 000. What are the next three states?

- A) 011, 101, 000  ✔ official
- B) 001, 010, 111
- C) 011, 101, 111
- D) 001, 010, 000

---

**2021_AN_Q42** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters)

Suppose we want to design a synchronous circuit that processes a string of 0's and 1's. Given a string, it produces another string by replacing the first 1 in any subsequence of consecutive 1's by a 0. Consider the following example.
Input sequence : 00100011000011100
Output sequence : 00000001000001100
A Mealy Machine is a state machine where both the next state and the output are functions of the present state and the current input.
The above mentioned circuit can be designed as a two-state Mealy machine. The states in the Mealy machine can be represented using Boolean values 0 and 1. We denote the current state, the next state, the next incoming bit, and the output bit of the Mealy machine by the variables \(s\), \(t\), \(b\) and \(y\) respectively.
Assume the initial state of the Mealy machine is 0.
What are the Boolean expressions corresponding to \(t\) and \(y\) in terms of \(s\) and \(b\)?

- A) \(t = s + b\) \(y = sb\)
- B) \(t = b\) \(y = sb\)  ✔ official
- C) \(t = b\) \(y = s\bar{b}\)
- D) \(t = s + b\) \(y = s\bar{b}\)

---

**2021_FN_Q64** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the following Boolean expression:
\(F = (X + Y + Z)(\overline{X} + Y)(\overline{Y} + Z)\)
Which of the following Boolean expressions is/are equivalent to \(\overline{F}\)?

- A) \((\overline{X} + \overline{Y} + \overline{Z})(X + \overline{Y})(Y + \overline{Z})\)
- B) \(X\overline{Y} + \overline{Z}\)  ✔ official
- C) \((X + \overline{Z})(\overline{Y} + \overline{Z})\)  ✔ official
- D) \(X\overline{Y} + Y\overline{Z} + \overline{X}\overline{Y}\overline{Z}\)  ✔ official

---

**2021_AN_Q49** · 2021-AN · NAT · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider a Boolean function \(f(w, x, y, z)\) such that
\(f(w, 0, 0, z) = 1\)
\(f(1, x, 1, z) = x + z\)
\(f(w, 1, y, z) = wz + y\)
The number of literals in the minimal sum-of-products expression of \(f\) is _________.

Official answer (numeric): 6 to 6

---

**2020_FN_Q25** · 2020-FN · NAT · 1 mark · Easy · bank topic: Combinational Logic (Multiplexers, Decoders, Adders)

A multiplexer is placed between a group of 32 registers and an accumulator to regulate data movement such that at any given point in time the content of only one register will move to the accumulator. The minimum number of select lines needed for the multiplexer is _________.

Official answer (numeric): 5 to 5

---

**2020_FN_Q26** · 2020-FN · NAT · 1 mark · Easy · bank topic: Combinational Logic (Multiplexers, Decoders, Adders)

If there are \( m \) input lines and \( n \) output lines for a decoder that is used to uniquely address a byte addressable 1 KB RAM, then the minimum value of \( m + n \) is ________.

Official answer (numeric): 1034 to 1034

---

**2020_FN_Q54** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps · HAS A FIGURE (not shown here)

Consider the Boolean function \( z(a, b, c) \).
[IMAGE_Q_54]
Which one of the following minterm lists represents the circuit given above?

- A) \( z = \sum(0, 1, 3, 7) \)
- B) \( z = \sum(1, 4, 5, 6, 7) \)  ✔ official
- C) \( z = \sum(2, 4, 5, 6, 7) \)
- D) \( z = \sum(2, 3, 5) \)

---

**2020_FN_Q59** · 2020-FN · MCQ · 2 marks · Hard · bank topic: Number Representations & Fixed/Floating Point Math

Consider three registers R1, R2, and R3 that store numbers in IEEE-754 single precision floating point format. Assume that R1 and R2 contain the values (in hexadecimal notation) 0x42200000 and 0xC1200000, respectively.
If R3 = R1 / R2, what is the value stored in R3?

- A) 0x40800000
- B) 0xC0800000  ✔ official
- C) 0x83400000
- D) 0xC8500000

---

**2019_FN_Q22** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

The chip selects logic for a certain DRAM chip in memory system design is shown below. Assume that memory has 16 address lines denoted by \( A_{15} \) to \( A_0 \). What is the range of addresses (in hexadecimal) of the memory system that can get enabled by the chip select (CS) signal?
[IMAGE_Q_22]

- A) C800 to CFFF  ✔ official
- B) CA00 to CAFF
- C) C800 to C8FF
- D) DA00 to DFFF

---

**2019_FN_Q17** · 2019-FN · MCQ · 1 mark · Easy · bank topic: Number Representations & Fixed/Floating Point Math

In 16-bit 2’s complement representation, the decimal number –28 is:

- A) 1111 1111 0001 1100
- B) 0000 0000 1110 0100
- C) 1111 1111 1110 0100  ✔ official
- D) 1000 0000 1110 0100

---

**2019_FN_Q18** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Which one of the following is NOT a valid identity?

- A) \( (x \oplus y) \oplus z = x \oplus (y \oplus z) \)
- B) \( (x + y) \oplus z = x \oplus (y + z) \)  ✔ official
- C) \( x \oplus y = x + y \), if \( xy = 0 \)
- D) \( x \oplus y = (xy + x'y')' \)

---

**2019_FN_Q33** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Consider Z = X – Y, where X, Y and Z are all in sign-magnitude form. X and Y are each represented in \( n \) bits. To avoid overflow, the representation of Z would require a minimum of:

- A) \( n \) bits
- B) \( n - 1 \) bits
- C) \( n + 1 \) bits  ✔ official
- D) \( n + 2 \) bits

---

**2019_FN_Q56** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Combinational Logic (Multiplexers, Decoders, Adders) · HAS A FIGURE (not shown here)

Consider three 4-variable functions \( f_1 \), \( f_2 \) and \( f_3 \), which are expressed in sum-of-minterms as
\( f_1 = \Sigma(0, 2, 5, 8, 14) \)
\( f_2 = \Sigma(2, 3, 6, 8, 14, 15) \)
\( f_3 = \Sigma(2, 7, 11, 14) \)
For the following circuit with one AND gate and one XOR gate, the output function \( f \) can be expressed as:
[IMAGE_Q_56]

- A) \( \Sigma(7, 8, 11) \)  ✔ official
- B) \( \Sigma(2, 7, 8, 11, 14) \)
- C) \( \Sigma(2, 14) \)
- D) \( \Sigma(0, 2, 3, 5, 6, 7, 8, 11, 14, 15) \)

---

**2019_FN_Q49** · 2019-FN · NAT · 2 marks · Hard · bank topic: Boolean Algebra, Minimization, K-Maps

What is the minimum number of 2-input NOR gates required to implement 4-variable function expressed in sum-of-minterms form as \( f = \Sigma(0, 2, 5, 7, 8, 10, 13, 15) \)? Assume that all the inputs and their complements are available ________.

Official answer (numeric): 3 to 3

---

**2018_FN_Q14** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Boolean Algebra, Minimization, K-Maps

Let \(\oplus\) and \(\odot\) denote the Exclusive OR and Exclusive NOR operations, respectively. Which one of the following is NOT CORRECT?

- A) \(\overline{P \oplus Q} = P \odot Q\)
- B) \(\bar{P} \oplus Q = P \odot Q\)
- C) \(\bar{P} \oplus \bar{Q} = P \oplus Q\)
- D) \((P \oplus \bar{P}) \oplus Q = (P \odot \bar{P}) \odot \bar{Q}\)  ✔ official

---

**2018_FN_Q32** · 2018-FN · NAT · 1 mark · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider the sequential circuit shown in the figure, where both flip-flops used are positive edge-triggered D flip-flops.
[IMAGE_Q_32]
The number of states in the state transition diagram of this circuit that have a transition back to the same state on some value of “in” is _____.

Official answer (numeric): 2 to 2

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

**2018_FN_Q59** · 2018-FN · NAT · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the minterm list form of a Boolean function \(F\) given below.
\(F(P, Q, R, S) = \sum m(0, 2, 5, 7, 9, 11) + d(3, 8, 10, 12, 14)\)
Here, \(m\) denotes a minterm and \(d\) denotes a don’t care term. The number of essential prime implicants of the function \(F\) is ______.

Official answer (numeric): 3 to 3

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

**2017_FN_Q26** · 2017-FN · NAT · 1 mark · Medium · bank topic: Boolean Algebra, Minimization, K-Maps · HAS A FIGURE (not shown here)

Consider the Karnaugh map given below, where X represents "don't care" and blank represents 0.
[IMAGE_Q_26]
Assume for all inputs (\(a, b, c, d\)), the respective complements (\(\bar{a}, \bar{b}, \bar{c}, \bar{d}\)) are also available. The above logic is implemented using 2-input NOR gates only. The minimum number of gates required is ________.

Official answer (numeric): 1.0 to 1.0

---

**2017_AN_Q25** · 2017-AN · NAT · 1 mark · Medium · bank topic: Number Representations & Fixed/Floating Point Math

Consider a quadratic equation \(x^2 - 13x + 36 = 0\) with coefficients in a base '\(b\)'. The solutions of this equation in the same base '\(b\)' are \(x = 5\) and \(x = 6\). Then \(b = \) ________.

Official answer (numeric): 8.0 to 8.0

---

**2017_AN_Q43** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

If \(w, x, y, z\) are Boolean variables, then which one of the following is INCORRECT?

- A) \(wx + w(x + y) + x(x + y) = x + wy\)
- B) \(\overline{w\bar{x}(y + \bar{z})} + \bar{w}x = \bar{w} + x + \bar{y}z\)
- C) \((w\bar{x}(y + x\bar{z}) + \bar{w}\bar{x})y = x\bar{y}\)  ✔ official
- D) \((w + y)(wxy + wyz) = wxy + wyz\)

---

**2017_AN_Q41** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Given \(f(w, x, y, z) = \Sigma_m(0, 1, 2, 3, 7, 8, 10) + \Sigma_d(5, 6, 11, 15)\), where d represents the \textit{don't-care} condition in Karnaugh maps. Which of the following is a minimum product-of-sums (POS) form of \(f(w, x, y, z)\)?

- A) \(f = (\bar{w} + \bar{z})(\bar{x} + z)\)  ✔ official
- B) \(f = (\bar{w} + z)(x + z)\)
- C) \(f = (w + z)(\bar{x} + z)\)
- D) \(f = (w + \bar{z})(\bar{x} + z)\)

---

**2017_FN_Q59** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a combination of T and D flip-flops connected as shown below. The output of the D flip-flop is connected to the input of the T flip-flop and the output of the T flip-flop is connected to the input of the D flip-flop.
[IMAGE_Q_59]
Initially, both \(Q_0\) and \(Q_1\) are set to 1 (before the \(1^{\text{st}}\) clock cycle). The outputs

- A) \(Q_1\) \(Q_0\) after the \(3^{\text{rd}}\) cycle are 11 and after the \(4^{\text{th}}\) cycle are 00 respectively.
- B) \(Q_1\) \(Q_0\) after the \(3^{\text{rd}}\) cycle are 11 and after the \(4^{\text{th}}\) cycle are 01 respectively.  ✔ official
- C) \(Q_1\) \(Q_0\) after the \(3^{\text{rd}}\) cycle are 00 and after the \(4^{\text{th}}\) cycle are 11 respectively.
- D) \(Q_1\) \(Q_0\) after the \(3^{\text{rd}}\) cycle are 01 and after the \(4^{\text{th}}\) cycle are 01 respectively.

---

**2017_AN_Q45** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

The next state table of a 2-bit saturating up-counter is given below.
[IMAGE_Q_45]
The counter is built as a synchronous sequential circuit using T flip-flops. The expressions for \(T_1\) and \(T_0\) are

- A) \(T_1 = Q_1 Q_0, T_0 = \bar{Q}_1 \bar{Q}_0\)
- B) \(T_1 = \bar{Q}_1 Q_0, T_0 = \bar{Q}_1 + \bar{Q}_0\)  ✔ official
- C) \(T_1 = Q_1 + Q_0, T_0 = \bar{Q}_1 + \bar{Q}_0\)
- D) \(T_1 = Q_1 Q_0, T_0 = Q_1 + Q_0\)

---

