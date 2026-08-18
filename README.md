# CV Analyser

CV Analyser is a web application that helps users analyze and get insights on their resumes/CVs. This repository contains the **frontend**, built with [Angular](https://angular.dev/).

## ✨ Features

- Modern, responsive UI with light/dark theme support
- CV upload and analysis workflow
- Clean and accessible design system (CSS custom properties for theming)

> Update this list with the actual features of your app.

## 🛠️ Tech Stack

- **Framework:** Angular (v21)
- **Language:** TypeScript
- **Styling:** SCSS
- **Testing:** Vitest (unit tests)
- **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Angular CLI](https://angular.dev/tools/cli) installed globally:

```bash
npm install -g @angular/cli
```

### Installation

```bash
git clone <repo-url>
cd cv-analyser
npm install
```

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 🧩 Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 📦 Building

To build the project for production, run:

```bash
ng build
```

This compiles the project and stores the build artifacts in the `dist/cv-analyser/browser/` directory. The production build is optimized for performance and speed.

## ✅ Running Unit Tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use:

```bash
ng test
```

## 🔄 Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

> Angular CLI does not include an e2e testing framework by default. You can choose one that suits your needs (e.g. Playwright, Cypress).

## ☁️ Deployment (Vercel)

This project is deployed on [Vercel](https://vercel.com/). Key configuration:

| Setting | Value |
|---|---|
| Build Command | `ng build` |
| Output Directory | `dist/cv-analyser/browser` |
| Install Command | `npm install` |

A `vercel.json` file is included at the project root to correctly handle Angular's client-side routing (SPA rewrites):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 📁 Project Structure

```
cv-analyser/
├── src/
│   ├── app/
│   ├── assets/
│   └── styles/
├── vercel.json
├── angular.json
└── package.json
```

## 📚 Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

> Update this section according to your project's actual license.