# AI CV Screening

AI CV Screening is a full-stack recruitment app that helps evaluate and rank candidates based on their CVs.

The idea is simple:

1. Create a job
2. Add evaluation criteria and mandatory requirements
3. Upload candidate CVs
4. Let AI extract and analyze the candidate information
5. Calculate a match score
6. Rank candidates from best match to lowest match

The project is built with Next.js, TypeScript, PostgreSQL, Prisma and OpenAI.

## Main Features

- Create, edit and delete jobs
- Add weighted evaluation criteria
- Add mandatory requirements
- Upload CV files
- Extract candidate data from CVs
- Evaluate candidates with AI
- Calculate match scores
- Rank candidates automatically
- Show AI reasoning
- View uploaded CVs
- Delete candidates
- Re-evaluate candidates after editing a job
- Store all data in PostgreSQL

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js Route Handlers
- OpenAI API
- Zod

### Database

- PostgreSQL
- Prisma ORM

### CV Processing

- PDF
- DOCX
- TXT
- Mammoth

## Project Structure

The project uses a feature-based structure.

```text
app/
├── api/
└── page.tsx

components/
└── ui/

features/
├── applications/
├── cv-processing/
├── dashboard/
├── evaluations/
└── jobs/

lib/
└── db/

prisma/
└── schema.prisma
```

Reusable UI components are inside:

```text
components/ui
```

Feature-specific code is kept inside:

```text
features/
```

For example:

```text
features/jobs
features/applications
features/evaluations
```

This keeps the project easier to organize and maintain.

## How the Evaluation Works

AI analyzes the candidate and selects a level for every evaluation criterion.

The levels are:

```text
NONE       = 0
WEAK       = 2
PARTIAL    = 4
GOOD       = 6
STRONG     = 8
EXCELLENT  = 10
```

The AI does not directly decide the final percentage.

The application calculates the final score using the criterion weights.

Example:

```text
Technical Skills

Weight: 40%
Score: 8/10

8 / 10 × 40 = 32
```

The weighted scores are added together to create the final match score.

The final categories are:

```text
85–100  Strong Match
65–84   Potential Match
0–64    Unmatched
```

If a candidate fails a mandatory requirement, the candidate becomes `Unmatched` even if the numeric score is high.

## Database

The main database models are:

```text
Job
Candidate
Application
Evaluation
CvExtractionCache
```

The basic relationship is:

```text
Job
 ↓
Application
 ↓
Candidate + Evaluation
```

Prisma is used to communicate with PostgreSQL.

## API

The backend uses Next.js Route Handlers.

Some examples:

```text
POST   /api/jobs
PATCH  /api/jobs/[id]
DELETE /api/jobs/[id]

POST   /api/applications
DELETE /api/applications/[id]

GET    /api/applications/[id]/cv
```

## CV Flow

When a CV is uploaded, the flow is:

```text
Upload CV
   ↓
Read the file
   ↓
Extract candidate information
   ↓
AI evaluation
   ↓
Calculate score
   ↓
Save to database
   ↓
Show candidate ranking
```

## Setup

Clone the project:

```bash
git clone https://github.com/jurik-latifi/ai-cv-screening.git
```

Open the project:

```bash
cd ai-cv-screening
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add:

```env
DATABASE_URL="your_postgresql_connection_string"
OPENAI_API_KEY="your_openai_api_key"
```

Generate Prisma:

```bash
npx prisma generate
```

Set up the database:

```bash
npx prisma db push
```

Run the project:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Prisma Studio

To check the database visually:

```bash
npx prisma studio
```

## Useful Commands

Run development server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Build the project:

```bash
npm run build
```

## AI Status

The dashboard shows:

```text
AI Active
```

when `OPENAI_API_KEY` exists.

If the API key is missing, it shows:

```text
AI Inactive
```

This only checks if the key is configured. It is not a live OpenAI status check.

## Why I Built It This Way

I wanted the AI to help understand the CV, but not control the final score completely.

AI analyzes the candidate and explains its reasoning.

The application itself handles:

- scoring
- weights
- mandatory rules
- final match category

This makes the result more consistent and easier to understand.

## Author

Built as an AI-powered CV screening project using Next.js, PostgreSQL, Prisma and OpenAI.