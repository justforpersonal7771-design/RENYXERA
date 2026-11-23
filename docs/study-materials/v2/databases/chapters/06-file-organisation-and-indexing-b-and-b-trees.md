# Review input: Databases, chapter 06: File organisation and indexing (B and B+ trees)

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-06-file-organisation-and-indexing-b-and-b-trees.md` and `gemini-06-file-organisation-and-indexing-b-and-b-trees.md` in this folder.

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

This is **one chapter** (6 of 8) of the Databases book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **File organisation and indexing (B and B+ trees)**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (10)

**2026_AN_Q46** · 2026-AN · MCQ · 2 marks · Medium · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

An index in a DBMS is said to be dense if an index entry appears for every search-key value in the indexed file. Otherwise it is called a sparse index. Consider the following two statements.
S1: A hash index must be a dense index
S2: A B+ tree index can be a sparse index
Which one of the following options is correct?

- A) Both S1 and S2 are true  ✔ official
- B) Both S1 and S2 are false
- C) S1 is true and S2 is false
- D) S1 is false and S2 is true

---

**2025_FN_Q21** · 2025-FN · MSQ · 1 mark · Medium · bank topic: File Organization & Indexing (e.g., B and B+ Trees) · HAS A FIGURE (not shown here)

Consider the following \( B^+ \) tree with 5 nodes, in which a node can store at most 3 key values. The value 23 is now inserted in the \( B^+ \) tree. Which of the following options(s) is/are CORRECT?
[IMAGE_Q_21_1]

- A) None of the nodes will split.
- B) At least one node will split and redistribute.  ✔ official
- C) The total number of nodes will remain same.
- D) The height of the tree will increase.  ✔ official

---

**2025_AN_Q57** · 2025-AN · NAT · 2 marks · Hard · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

In a B+ - tree where each node can hold at most four key values, a root to leaf path consists of the following nodes:
A = (49, 77, 83, –), B = (7, 19, 33, 44), C = (20*, 22*, 25*, 26*)
The *-marked keys signify that these are data entries in a leaf.
Assume that a pointer between keys \( k_1 \) and \( k_2 \) points to a subtree containing keys in \( [k_1, k_2) \), and that when a leaf is created, the smallest key in it is copied up into its parent.
A record with key value 23 is inserted into the B+ - tree.
The smallest key value in the parent of the leaf that contains 25* is ________.
(Answer in integer)

Official answer (numeric): 33 to 33

---

**2024_FN_Q11** · 2024-FN · MCQ · 1 mark · Easy · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

In a B+ tree, the requirement of at least half-full (50%) node occupancy is relaxed for which one of the following cases?

- A) Only the root node  ✔ official
- B) All leaf nodes
- C) All internal nodes
- D) Only the leftmost leaf node

---

**2024_AN_Q16** · 2024-AN · MSQ · 1 mark · Easy · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

Which of the following file organizations is/are I/O efficient for the scan operation in DBMS?

- A) Sorted  ✔ official
- B) Heap  ✔ official
- C) Unclustered tree index
- D) Unclustered hash index

---

**2023_FN_Q62** · 2023-FN · NAT · 2 marks · Hard · bank topic: File Organization & Indexing (e.g., B and B+ Trees) · HAS A FIGURE (not shown here)

Consider a database of fixed-length records, stored as an ordered file. The database has 25,000 records, with each record being 100 bytes, of which the primary key occupies 15 bytes. The data file is block-aligned in that each data record is fully contained within a block. The database is indexed by a primary index file, which is also stored as a block-aligned ordered file. The figure below depicts this indexing scheme.
[IMAGE_Q_62]
Suppose the block size of the file system is 1024 bytes, and a pointer to a block occupies 5 bytes. The system uses binary search on the index file to search for a record with a given key. You may assume that a binary search on an index file of b blocks takes \(\lceil \log_2 b \rceil\) block accesses in the worst case. Given a key, the number of block accesses required to identify the block in the data file that may contain a record with the key, in the worst case, is________.

Official answer (numeric): 6 to 6

---

**2021_AN_Q26** · 2021-AN · NAT · 1 mark · Medium · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

A data file consisting of 1,50,000 student-records is stored on a hard disk with block size of 4096 bytes. The data file is sorted on the primary key RollNo. The size of a record pointer for this disk is 7 bytes. Each student-record has a candidate key attributed called ANum of size 12 bytes. Suppose an index file with records consisting of two fields, ANum value and the record pointer to the corresponding student record, is built and stored on the same disk. Assume that the records of data file and index file are not split across disk blocks. The number of blocks in the index file is _________.

Official answer (numeric): 698 to 698

---

**2020_FN_Q51** · 2020-FN · NAT · 2 marks · Hard · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

Consider a database implemented using B+ tree for file indexing and installed on a disk drive with block size of 4 KB. The size of search key is 12 bytes and the size of tree/disk pointer is 8 bytes. Assume that the database has one million records. Also assume that no node of the B+ tree and no records are present initially in main memory. Consider that each record fits into one disk block. The minimum number of disk accesses required to retrieve any record in the database is ________.

Official answer (numeric): 4 to 4

---

**2019_FN_Q20** · 2019-FN · MCQ · 1 mark · Easy · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

Which one of the following statements is NOT correct about the B+ tree data structure used for creating an index of a relational database table?

- A) B+ tree is a height balanced tree
- B) Non-leaf nodes have pointers to data records  ✔ official
- C) Key values in each node are kept in sorted order
- D) Each leaf node has a pointer to the next leaf node

---

**2017_AN_Q54** · 2017-AN · NAT · 2 marks · Medium · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

In a B\(^+\) tree, if the search-key value is 8 bytes long, the block size is 512 bytes and the block pointer size is 2 bytes, then the maximum order of the B\(^+\) tree is________.

Official answer (numeric): 52.0 to 52.0

