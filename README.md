# Alma Assessment Frontend

This is the frontend for the Alma Assessment application, built with Next.js, TypeScript, Tailwind CSS, shadcn/ui and other modern tools.

## Prerequisites

Before starting the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/)

## Env

- [Staging](https://alma-fe-assessment.vercel.app/)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/larodiel/alma-fe-assessment
   cd alma-assessment-fe
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file at root and set the following variables:

   1. `NEXTAUTH_SECRET=970cd86203bdf4bdf6d764eb7f1edae2`
   2. `NEXTAUTH_URL="http://localhost:3000"`

4. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Building the Project

To build the project for production:

```bash
npm run build
```

The built files will be located in the `.next` directory.

## Running the Production Build

After building the project, you can start the production server:

```bash
npm run start
```

## Linting and Formatting

To lint the code:

```bash
npm run lint
```

## Demo Credentials

**Login route:** `/login`
**User:** `user@example.com`
**Pass:** `o{%LO(.~JXnWG543_A-8`

**Assessment route:** `/assessment`

## Deployment

This project is designed to be deployed on [Vercel](https://vercel.com/). Simply connect the repository to your Vercel account, and it will handle the deployment process automatically.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/docs)
