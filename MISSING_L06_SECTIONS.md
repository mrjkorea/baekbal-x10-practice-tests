# Missing X-10 section packs (중2능률 + 중2동아 L05–L06)

Goal: 36 quizzes = 9 per book×lesson × 2 lessons × 2 books  
(6 section drills + 3 최종점검 모의고사)

## Shipped (27)

| Book | Lesson | Sections (6) | 모의고사 (3) |
|------|--------|--------------|--------------|
| 중2능률 | L05 | ✅ 어휘/대화빈칸/대화영작/Reading문장/Reading빈칸/Review | ✅ 1·2·3회 (live JSON kept) |
| 중2능률 | L06 | ✅ same 6 (from `jung2/pages/l06/build_remaining.py`) | ✅ 1·2·3회 (live JSON kept) |
| 중2동아 | L05 | ✅ same 6 (`donga/src/pack_l05_x10.py`) | ✅ 1·2·3 (`pack_l05_final.py`) |
| 중2동아 | L06 | ❌ none | ❌ none |

## Missing — 중2동아 L06 X-10 (9 quizzes)

No dedicated packer exists. `donga/src/pack_l06_1.py` … `pack_l06_4.py` emit **본책** Vocabulary/Dialog/Grammar/Reading files, **not** the X-10 six:

1. `중2동아_L06_X-10_어휘_확인_문제`
2. `중2동아_L06_X-10_대화_빈칸_완성하기`
3. `중2동아_L06_X-10_대화_영작하기`
4. `중2동아_L06_X-10_Reading_문장_완성하기`
5. `중2동아_L06_X-10_Reading_빈칸_완성하기`
6. `중2동아_L06_X-10_핵심_문장_Review`
7. `중2동아_L06_X-10_최종점검_모의고사_1회`
8. `중2동아_L06_X-10_최종점검_모의고사_2회`
9. `중2동아_L06_X-10_최종점검_모의고사_3회`

Source text exists at `/workspace/donga/text/l06_x10.txt` and `/workspace/donga/text/l06_final.txt` but was **not** packed into ironclad X-10 xlsx. Do not invent stems; write `pack_l06_x10.py` + final packer when ready.

## Notes

- Do **not** use `/workspace/mse1-xlsx/L05_X-10*` or `L06_X-10*` for 중2능률 (wrong book).
- 능률 L06 대화 빈칸/영작 packs are thinner (5 items each; OCR/답지 reconstruction) but ship as emitted by the pack script.
- Grammar xlsx exist for some lessons but are **out of scope** for the 36-quiz target (not one of the 6 section drills).
