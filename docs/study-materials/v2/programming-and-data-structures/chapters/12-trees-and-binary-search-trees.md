# Review input: Programming and Data Structures, chapter 12: Trees and binary search trees

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-12-trees-and-binary-search-trees.md` and `gemini-12-trees-and-binary-search-trees.md` in this folder.

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

This is **one chapter** (12 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 12 · Trees and binary search trees  (High weight; 18 PYQs, 25 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D7 Trees: vocabulary, counting facts, traversals, rebuilding from traversals | [MUST] | 11 | 2026_FN_Q33, 2026_AN_Q12, 2025_AN_Q13, 2023_FN_Q47, 2022_FN_Q28, 2018_FN_Q30, 2017_FN_Q33 | Full-tree counts and heights, traversal match, rebuild from two orders, node-count formulas. |
| D8 Binary search trees: search, insert, delete, orders, counting | [MUST] | 8 | 2026_FN_Q40, 2026_FN_Q62, 2026_AN_Q49, 2025_FN_Q26, 2025_AN_Q35, 2024_AN_Q40, 2021_FN_Q63, 2020_FN_Q20, 2020_FN_Q47, 2017_AN_Q63 | Pre-order to post-order, BST statements, height after inserts, range reporting cost, which element can be third inserted. |
| D9 AVL trees: rotations, minimum nodes, cost | [SHOULD] | 6 | 2020_FN_Q23 | AVL insertion cost. |




## The PYQs for this chapter (18)

**2026_AN_Q12** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Linked Lists & Binary Trees

The set T represents various traversals over binary tree. The set S represents the order of visiting nodes during a traversal.
**T**
I: Inorder
II: Preorder
III: Postorder
**S**
L: left subtree, node, right subtree
M: node, left subtree, right subtree
N: left subtree, right subtree, node
Which one of the following is the correct match from T to S?

- A) I – L, II – M, III – N  ✔ official
- B) I – M, II – L, III – N
- C) I – N, II – M, III – L
- D) I – L, II – N, III – M

---

**2026_FN_Q33** · 2026-FN · NAT · 1 mark · Easy · bank topic: Linked Lists & Binary Trees

The height of a binary tree is the number of edges in the longest path from the root to a leaf in the tree. The maximum possible height of a full binary tree with 23 nodes is ________. (answer in integer)

Official answer (numeric): 11 to 11

---

**2026_FN_Q40** · 2026-FN · MCQ · 2 marks · Hard · bank topic: BSTs & Binary Heaps

Let \( P \) be the set of all integers from 1 to 15. Consider any order of insertion of the elements of \( P \) into a binary search tree that creates a complete binary tree.
Which one of the following elements can NEVER be the third element that is inserted?

- A) 4
- B) 2
- C) 10
- D) 5  ✔ official

---

**2026_AN_Q49** · 2026-AN · MSQ · 2 marks · Hard · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Consider a binary search tree (BST) with \( n \) leaf nodes (\( n > 0 \)). Given any node \( V \), the key present in the node is denoted as \( \text{Val}(V) \). All the keys present in the given BST are distinct. The keys belong to the set of real numbers.
For a node \( V \), let \( \text{Suc}(V) \) denote the node that is its inorder successor. If a node \( V \) does not have an inorder successor, then \( \text{Suc}(V) \) is NULL. As there are no duplicates, if \( \text{Suc}(V) \) is not NULL, then \( \text{Val}(V) < \text{Val}(\text{Suc}(V)) \).
Corresponding to every leaf node \( L_i \) that has a non-NULL \( \text{Suc}(L_i) \), a new key \( k_i \) with the following property is to be inserted into the BST.
\( \text{Val}(L_i) < k_i < \text{Val}(\text{Suc}(L_i)) \)
Let \( K \) represent the list of all such new keys to be inserted into the BST.
Which of the following statements is/are true?

- A) \( K \) cannot have any duplicates  ✔ official
- B) \( K \) will have at least one element
- C) After inserting all keys from \( K \), the height of the BST can increase at most by one  ✔ official
- D) Number of nodes in the BST will double after inserting all keys from \( K \)

---

**2026_FN_Q62** · 2026-FN · NAT · 2 marks · Medium · bank topic: BSTs & Binary Heaps

The following sequence corresponds to the preorder traversal of a binary search tree:
50, 25, 13, 40, 30, 47, 75, 60, 70, 80, 77
The position of the element 60 in the postorder traversal of \( T \) is ________. (answer in integer)
**Note:** The position begins with 1.

Official answer (numeric): 7 to 7

---

**2025_AN_Q13** · 2025-AN · MCQ · 1 mark · Easy · bank topic: Linked Lists & Binary Trees

Consider a binary tree \( T \) in which every node has either zero or two children. Let \( n > 0 \) be the number of nodes in \( T \).
Which ONE of the following is the number of nodes in \( T \) that have exactly two children?

- A) \( \frac{n - 2}{2} \)
- B) \( \frac{n - 1}{2} \)  ✔ official
- C) \( \frac{n}{2} \)
- D) \( \frac{n + 1}{2} \)

---

**2025_FN_Q26** · 2025-FN · MSQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Which of the following statement(s) is/are TRUE for any binary search tree (BST) having \( n \) distinct integers?

- A) The maximum length of a path from the root node to any other node is \( (n - 1) \).  ✔ official
- B) An inorder traversal will always produce a sorted sequence of elements.  ✔ official
- C) Finding an element takes \( O(\log_2 n) \) time in the worst case.
- D) Every BST is also a Min-Heap.

---

**2025_AN_Q35** · 2025-AN · NAT · 1 mark · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Suppose the values 10, -4, 15, 30, 20, 5, 60, 19 are inserted in that order into an initially empty binary search tree. Let \( T \) be the resulting binary search tree. The number of edges in the path from the node containing 19 to the root node of \( T \) is ________. (Answer in integer)

Official answer (numeric): 4 to 4

---

**2024_AN_Q40** · 2024-AN · MCQ · 2 marks · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

You are given a set \( V \) of distinct integers. A binary search tree \( T \) is created by inserting all elements of \( V \) one by one, starting with an empty tree. The tree \( T \) follows the convention that, at each node, all values stored in the left subtree of the node are smaller than the value stored at the node. You are not aware of the sequence in which these values were inserted into \( T \), and you do not have access to \( T \).
Which one of the following statements is TRUE?

- A) Inorder traversal of \( T \) can be determined from \( V \).  ✔ official
- B) Root node of \( T \) can be determined from \( V \).
- C) Preorder traversal of \( T \) can be determined from \( V \).
- D) Postorder traversal of \( T \) can be determined from \( V \).

---

**2023_FN_Q47** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · HAS A FIGURE (not shown here)

Consider the C function foo and the binary tree shown:
```c
typedef struct node {
    int val;
    struct node *left, *right;
} node;
int foo(node *p) {
    int retval;
    if (p == NULL)
        return 0;
    else {
        retval = p->val + foo(p->left) + foo(p->right);
        printf("%d ", retval);
        return retval;
    }
}
```
[IMAGE_Q_47_1]
When foo is called with a pointer to the root node of the given binary tree, what will it print?

- A) 3 8 5 13 11 10
- B) 3 5 8 10 11 13
- C) 3 8 16 13 24 50  ✔ official
- D) 3 16 8 50 24 13

---

**2022_FN_Q28** · 2022-FN · NAT · 1 mark · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Suppose a binary search tree with 1000 distinct elements is also a complete binary tree. The tree is stored using the array representation of binary heap trees. Assuming that the array indices start with 0, the \(3^{\text{rd}}\) largest element of the tree is stored at index _________.

Official answer (numeric): 509 to 509

---

**2021_FN_Q63** · 2021-FN · MCQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

A binary search tree \(T\) contains \(n\) distinct elements. What is the time complexity of picking an element in \(T\) that is smaller than the maximum element in \(T\)?

- A) \(\theta(n \log n)\)
- B) \(\theta(n)\)
- C) \(\theta(\log n)\)
- D) \(\theta(1)\)  ✔ official

---

**2020_FN_Q20** · 2020-FN · MCQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

The preorder traversal of a binary search tree is 15, 10, 12, 11, 20, 18, 16, 19. Which one of the following is the postorder traversal of the tree?

- A) 10, 11, 12, 15, 16, 18, 19, 20
- B) 11, 12, 10, 16, 19, 18, 20, 15  ✔ official
- C) 20, 19, 18, 16, 15, 12, 11, 10
- D) 19, 16, 18, 20, 11, 12, 10, 15

---

**2020_FN_Q23** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

What is the worst case time complexity of inserting \( n^2 \) elements into an AVL-tree with \( n \) elements initially?

- A) \( \Theta(n^4) \)
- B) \( \Theta(n^2) \)
- C) \( \Theta(n^2 \log n) \)  ✔ official
- D) \( \Theta(n^3) \)

---

**2020_FN_Q47** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

In a balanced binary search tree with \( n \) elements, what is the worst case time complexity of reporting all elements in range \( [a, b] \)? Assume that the number of reported elements is \( k \).

- A) \( \Theta(\log n) \)
- B) \( \Theta(\log n + k) \)  ✔ official
- C) \( \Theta(k \log n) \)
- D) \( \Theta(n \log k) \)

---

**2018_FN_Q30** · 2018-FN · NAT · 1 mark · Medium · bank topic: Linked Lists & Binary Trees

The postorder traversal of a binary tree is 8,9,6,7,4,5,2,3,1. The inorder traversal of the same tree is 8,6,9,4,7,2,5,1,3. The height of a tree is the length of the longest path from the root to any leaf. The height of the binary tree above is ______.

Official answer (numeric): 4 to 4

---

**2017_FN_Q33** · 2017-FN · MCQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Let \(T\) be a binary search tree with 15 nodes. The minimum and maximum possible heights of \(T\) are:
Note: The height of a tree with a single node is 0.

- A) 4 and 15 respectively
- B) 3 and 14 respectively  ✔ official
- C) 4 and 14 respectively
- D) 3 and 15 respectively

---

**2017_AN_Q63** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

The pre-order traversal of a binary search tree is given by 12, 8, 6, 2, 7, 9, 10, 16, 15, 19, 17, 20. Then the post-order traversal of this tree is:

- A) 2, 6, 7, 8, 9, 10, 12, 15, 16, 17, 19, 20
- B) 2, 7, 6, 10, 9, 8, 15, 17, 20, 19, 16, 12  ✔ official
- C) 7, 2, 6, 8, 9, 10, 20, 17, 19, 15, 16, 12
- D) 7, 6, 2, 10, 9, 8, 15, 16, 17, 20, 19, 12

