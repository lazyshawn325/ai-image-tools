# AI Image Tools - Architecture & Best Practices

> Last Updated: 2026-02-11

This document outlines the critical architectural patterns and solutions used in this Next.js 15 + next-intl project.

## 1. Internationalization (next-intl) + SSG Pattern

### The Challenge
Next.js App Router Static Site Generation (SSG) renders pages independently. When using `next-intl`, the locale context must be explicitly set for every segment (Layouts and Pages) during the build process. Failure to do so results in `Error: Locale is required`.

### The Solution: Server Component Wrapper Pattern

For pages that need to be Client Components (e.g., interactive tools using `useState`), we cannot call the server-only `setRequestLocale` directly.

**Pattern:**
1.  **Wrapper (Server Component)**: `page.tsx`
2.  **Logic (Client Component)**: `PageClient.tsx`

**Implementation:**

`src/app/[locale]/tool-name/page.tsx`:
```typescript
import {setRequestLocale} from 'next-intl/server';
import PageClient from './PageClient';
import {routing} from '@/i18n/routing';

// 1. Export generateStaticParams (REQUIRED for SSG)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

// 2. Async Server Component
export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  
  // 3. Set Locale for next-intl (REQUIRED)
  setRequestLocale(locale);
  
  // 4. Render Client Component
  return <PageClient />;
}
```

`src/app/[locale]/tool-name/PageClient.tsx`:
```typescript
"use client";
export default function PageClient() {
  // Client-side logic here
}
```

### Layout Requirements
Every `layout.tsx` (Root and Nested) must also:
1. Accept `params`.
2. Call `setRequestLocale(locale)`.

---

## 2. Browser-Only Libraries (ONNX Runtime)

### The Challenge
Libraries like `onnxruntime-web` rely on browser APIs (`window`, `navigator`, WebGL/WASM) and will crash if imported during Server-Side Rendering (SSR) or Static Generation.

### The Solution: Dynamic Import

Do not import at the top level. Import inside the event handler or `useEffect`.

**Incorrect:**
```typescript
import * as ort from "onnxruntime-web"; // CRASHES SERVER
```

**Correct:**
```typescript
const handleProcess = async () => {
  // Dynamically load only when needed (on client)
  const ort = (await import("onnxruntime-web")) as any;
  // ... use ort
};
```

---

## 3. Navigation & Routing

### The Challenge
Using standard `next/link` with manual path construction (e.g., `href="/zh/about"`) breaks when switching locales or preserving query parameters, especially with `as-needed` locale prefix strategy.

### The Solution: next-intl Navigation

We configured `src/i18n/navigation.ts`:
```typescript
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
```

**Usage:**
Always import `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`, **NOT** from `next/link` or `next/navigation`.

```typescript
import { Link, usePathname } from '@/i18n/navigation';

// ...
<Link href={pathname} locale="en">Switch to English</Link>
```

---

## 4. UI & Styling

- **Styling**: Tailwind CSS 4 (`globals.css`)
- **Animation**: Framer Motion (`framer-motion`)
- **Components**:
  - `SpotlightCard`: Interactive card with **3D Tilt effect** (using `rotateX/rotateY` mouse tracking) and **Parallax Content** (`translateZ`).
  - `Bento Grid`: Implemented using CSS Grid with `auto-rows` and conditional `col-span/row-span` for visual rhythm.
  - `Mesh Gradients`: Dynamic multi-point radial gradients used for immersive backgrounds.
  - `Border Tracing`: Conic-gradient powered border animations for hover states.

## 5. SEO & Content Strategy

### Dynamic SEO Content Injection
To satisfy Google's content requirements for high-ranking tool pages, we use a **Namespace-based Injection** pattern.

**Pattern:**
1. Each tool's translation JSON contains an `SEO` object (title, features, howToUse, faq).
2. The `SEOContent` component automatically parses these arrays and renders them with semantic HTML (H2, lists, FAQ cards).
3. This adds ~500 words of indexable, high-value text to every tool page without cluttering the main functional UI.

### Structured Data (JSON-LD)
We automatically generate:
- `SoftwareApplication`: For the app rating and platform metadata.
- `HowTo`: (Implemented in components) providing step-by-step instructions to search engines.
- `FAQPage`: Enhancing SERP appearance with dropdown answers.

## 6. PWA Implementation

Using `next-pwa`, we generate a service worker that caches static assets. 
- **manifest.json**: Configured with tool-specific shortcuts for deep-linking.
- **Install Flow**: Custom `Header` logic listens for `beforeinstallprompt` to show a stylish install button only when available.

