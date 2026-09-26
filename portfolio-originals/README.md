# Photos avant / après

One folder per project, named in lowercase-with-dashes:

    portfolio-originals/
    ├─ boulangerie-paris-11/
    │  ├─ avant.jpg
    │  └─ apres.jpg
    └─ garage-montreuil/
       ├─ avant.png
       └─ apres.png

Then run `bun run images` and describe the project in `src/data/portfolio.ts`.
Originals are git-ignored; only the optimised WebP files in public/images/portfolio are committed.
