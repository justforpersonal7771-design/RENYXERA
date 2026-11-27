-- Question bank corrections found by the Gemini and ChatGPT reviews (28 Nov 2026) and confirmed by recomputation.
-- The same text fixes are already applied to public/data/questions.json and data/Aggregated_Output.json.
-- Run once in the Supabase SQL editor (owner). Each statement only changes a row whose text still holds the old wording, so it is safe to re-run.

-- 2021 FN Q27: S1 must end "-> q" (as printed, neither S1 nor S2 is a tautology; the official key B needs "-> q").
update public.questions set question_text = replace(question_text, '(\neg p \land (p \lor q)) \rightarrow p\)', '(\neg p \land (p \lor q)) \rightarrow q\)') where id = 'GATE_CS_2021_FN_Q27';

-- 2022 FN Q51: option C is f(5 * 2^n), not f(5.2^n).
update public.question_options set text = replace(text, 'f(5.2^n)', 'f(5 \cdot 2^n)') where question_id = 'GATE_CS_2022_FN_Q51' and option_id = 'C';

-- 2025 AN Q40: the grammar has bAc (capital A): then SLR(1) has two conflicts and LALR(1) none, which matches the key.
update public.questions set question_text = replace(question_text, 'S \rightarrow Aa \mid bac \mid dc', 'S \rightarrow Aa \mid bAc \mid dc') where id = 'GATE_CS_2025_AN_Q40';

-- 2026 AN Q41: the terminal a was printed as the Greek letter alpha.
update public.questions set question_text = replace(question_text, 'A \rightarrow \alpha A', 'A \rightarrow a A') where id = 'GATE_CS_2026_AN_Q41';

-- 2026 FN Q21: missing overline on the first P.
update public.questions set question_text = replace(question_text, 'F(P, Q) = (P + Q) \oplus', 'F(P, Q) = (\overline{P} + Q) \oplus') where id = 'GATE_CS_2026_FN_Q21';

-- 2025 AN Q43: option A lost its fourth minterm (it must equal option D).
update public.question_options set text = replace(text, 'w\overline{x}y\overline{z} + xz \)', 'w\overline{x}y\overline{z} + \overline{w}\overline{x}\overline{y}\overline{z} + xz \)') where question_id = 'GATE_CS_2025_AN_Q43' and option_id = 'A' and text not like '%\overline{w}\overline{x}\overline{y}\overline{z}%';

-- 2022 FN Q45: U is upper triangular, so the asked entry is U33 (not U32).
update public.questions set question_text = replace(question_text, 'U_{32}\), and', 'U_{33}\), and') where id = 'GATE_CS_2022_FN_Q45';
update public.question_options set text = replace(text, 'U_{32} = 2', 'U_{33} = 2') where question_id = 'GATE_CS_2022_FN_Q45' and option_id = 'B';

-- 2026 FN Q38: the stem said K = 2^k while the options use L.
update public.questions set question_text = replace(question_text, 'K = 2^k', 'K = 2^L') where id = 'GATE_CS_2026_FN_Q38';

-- 2022 FN Q56 and 2023 FN Q18: small wording slips.
update public.questions set question_text = replace(question_text, 'NOT EXIST' || chr(10), 'NOT EXISTS' || chr(10)) where id = 'GATE_CS_2022_FN_Q56';
update public.questions set question_text = replace(question_text, 'Let and ', 'Let ') where id = 'GATE_CS_2023_FN_Q18';

-- 2021 AN Q17: the smallest normalised positive number has exponent 00000001 and mantissa 0 = option A.
-- (Option C, exponent 0 and mantissa 0, is +0.0 and is not normalised.)
update public.question_answers set correct_option_ids = '{A}' where question_id = 'GATE_CS_2021_AN_Q17';
