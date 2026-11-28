-- 2023 FN Q37 (live variables): option D printed B2: {a, i, j}. Recomputed by program and confirmed on published solutions: B2 is {a, j}
-- (i is redefined in B4 before any use). The key D stays; only the option text is corrected. Safe to re-run.
update public.question_options
set text = replace(text, 'B2: {a, i, j}', 'B2: {a, j}')
where question_id = 'GATE_CS_2023_FN_Q37' and option_id = 'D' and text like '%B2: {a, i, j}%';

-- 2023 FN Q44 (multiplexers): the function is NOT A + A'C' + AB'C. The paper has A' + A'C' + AB'C (the first A is complemented), which equals A' + B'C and is realised by
-- option C (1, 1, 0, 1, 1, 1, 0, 0), the key. As printed, no option realises the function under any wiring (checked by program).
update public.questions
set question_text = replace(question_text, 'A + \overline{A}\cdot\overline{C} + A\cdot\overline{B}\cdot C', '\overline{A} + \overline{A}\cdot\overline{C} + A\cdot\overline{B}\cdot C')
where id = 'GATE_CS_2023_FN_Q44' and question_text like '%realise the Boolean function \( A + \overline{A}%';
