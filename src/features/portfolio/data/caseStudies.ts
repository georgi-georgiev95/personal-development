import type { ProjectCaseStudy } from './types'

export const projectCaseStudies: Record<string, ProjectCaseStudy> = {
  photobook: {
    context:
      'Photobook is the first complete product in the portfolio. It turns a simple gallery into a collaborative experience with authenticated contributions, social interactions, and moderation.',
    architecture:
      'The app is organized using Feature-Sliced Design. Photobook lives behind a lazy route boundary, while its Firebase-backed use cases are composed through dependency injection so the Firestore SDK does not affect the initial load.',
    implementation: [
      'Firebase Authentication controls signed-in actions such as uploads, comments, and reactions.',
      'Firestore subscriptions keep photos, comments, and reactions synchronized in real time.',
      'Storage handles uploaded images, with client-side compression before upload.',
      'Firestore rules enforce ownership, authenticated writes, and admin-only deletion paths.',
    ],
    quality: [
      'Business use cases have unit coverage under the repository 100% threshold.',
      'Loading, empty, authentication, error, and moderation states are part of the product flow.',
      'Responsive and keyboard-accessible gallery and modal interactions are treated as core behavior.',
    ],
    nextSteps: [
      'Add search and location filters.',
      'Add offline-aware states and optimistic interactions.',
      'Add a Playwright journey for upload, comment, and moderation flows.',
    ],
  },
  'personal-development': {
    context:
      'Personal Development is the portfolio platform itself: one application that contains focused projects and makes the engineering process inspectable.',
    architecture:
      'The repository uses React, TypeScript, Vite, Feature-Sliced Design, lazy route boundaries, a shared UI kit, and Linaria styles. Portfolio metadata is typed and feature-owned so project cards and case studies stay consistent.',
    implementation: [
      'The application shell owns routing, authentication providers, navigation, and global layout.',
      'Features own user-facing pages and behavior; entities own reusable business logic such as Photobook use cases.',
      'Heavy Three.js and Firebase modules are kept behind lazy boundaries and monitored by bundle budgets.',
      'The project harness defines repository guardrails, context rules, reusable skills, and repeatable delivery workflows.',
    ],
    quality: [
      'The quality gate runs lint, typecheck, formatting, coverage, build, and performance checks.',
      'Vitest currently passes 100% statements, branches, functions, and lines for the covered business-logic scope.',
      'Storybook documents reusable UI primitives and includes accessibility checks.',
      'GitHub Actions runs the quality gate and Firebase deployment workflows; their status is kept visible in the repository rather than guessed in the portfolio.',
    ],
    nextSteps: [
      'Expose live workflow and deployment status directly in the engineering page.',
      'Add the API Explorer as the next complete project.',
      'Add a portfolio assistant with a secure server-side AI integration.',
    ],
  },
}
