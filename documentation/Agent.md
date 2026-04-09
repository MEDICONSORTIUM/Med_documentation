# AGENT.md — Documentation Update: Milestone 2 + Design Specification

## Summary of changes

1. **Blog authors** — replace Kagisho with Msesenyane and Simamnkele
2. **Milestone 2** — mark M2 as active (M1 is now complete)
3. **Design Specification section** — new sidebar category with 5 pages embedding all diagrams and the PDF
4. **Static assets** — copy uploaded files into `static/assets/design-spec/`

---

## Step 1 — Copy static assets (do this first)

```bash
mkdir -p static/assets/design-spec
```

Copy these files into `static/assets/design-spec/`:

| File | Notes |
|------|-------|
| `Design_Specification_Document_v2.pdf` | Embedded as PDF viewer + download |
| `Med_Consort_Initial_UML.drawio` | Download link only |
| `Use_Case_Set.docx` | Download link only |
| `architecture.png` | Embedded as inline image |
| `FrontEOHA_drawio1.png` | Embedded as inline image |
| `EOHAERD_drawio.png` | Embedded as inline image |
| `UseCaseERD_drawio.png` | Embedded as inline image |
| `APIUseCase_drawio1.png` | Embedded as inline image |
| `wireframe.png` | Embedded as inline image |
| `Operational_Workflow.png` | Embedded as inline image |

---

## Step 2 — Replace / create these files

### `blog/authors.yml` — REPLACE ENTIRE FILE
New authors: `msesenyane` (Msesenyane Makhongela) and `simamnkele` (Simamnkele Mlisana). Remove `kagisho`.

### `blog/2026-04-01-milestone-2-kickoff.md` — CREATE NEW
New blog post by both authors announcing M2 prototype phase.

### `docs/milestones/overview.md` — REPLACE
M0 ✅, M1 ✅, **M2 🔵 Active**, M3 ⏳.

### `docs/milestones/milestone-2.md` — CREATE NEW
Full M2 spec: GEE pipeline, XGBoost flow, NCD pipeline, sprint plan, business + domain rules.

### `docs/design-specification/overview.md` — CREATE NEW
### `docs/design-specification/system-architecture-design.md` — CREATE NEW
### `docs/design-specification/data-architecture.md` — CREATE NEW
### `docs/design-specification/use-cases.md` — CREATE NEW
### `docs/design-specification/wireframes.md` — CREATE NEW
### `docs/design-specification/operational-workflow.md` — CREATE NEW

### `sidebars.js` — REPLACE ENTIRE FILE
Add Design Specification category (6 items) and milestone-2 to Project category.

---

## Step 3 — Update docusaurus.config.js

Change announcement bar id to `milestone2` and update text to:
```
🔵 Milestone 2 active — Prototype Development underway · <a href="...milestone-2">View M2 →</a>
```

---

## Step 4 — Update existing blog posts

Replace `authors: [kagisho]` with the appropriate author:
- Technical EO posts → `simamnkele`
- Team/progress posts → `msesenyane`
- General → `[msesenyane, simamnkele]`

---

## Verification checklist

- [ ] `static/assets/design-spec/` has all 10 files
- [ ] `blog/authors.yml` has `msesenyane` and `simamnkele`, no `kagisho`
- [ ] Sidebar has "Design Specification" with 5 child pages
- [ ] `/docs/design-specification/data-architecture` shows ERD images inline
- [ ] `/docs/design-specification/system-architecture-design` shows PDF iframe + download button
- [ ] `/docs/milestones/overview` shows M2 as 🔵 Active
- [ ] New blog post appears in blog list
- [ ] `npm run build` passes with no broken links