# WFO AI Chatbot

Fork of Vercel's AI Chatbot for Wound Force One. Next.js 16 + TypeScript + Tailwind + Drizzle ORM.

## Commands

```bash
pnpm dev             # Dev server at localhost:3000
pnpm build           # Production build
pnpm db:studio       # Database GUI
pnpm lint            # Biome linter (handles all formatting)
```

## Key Files

- **Chat UI**: `components/chat.tsx` → `messages.tsx` → `message.tsx`
- **Auth pages**: `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`
- **AI config**: `lib/ai/prompts.ts` (system prompt), `lib/ai/models.ts`
- **Database**: `lib/db/schema.ts` (schema), `lib/db/queries.ts` (all queries)

## Gotchas

- **Route groups**: `(auth)` and `(chat)` folders don't appear in URLs. `/login` = `app/(auth)/login/page.tsx`
- **Memoized components**: When adding props to `ChatHeader`, `Messages`, etc., update the `memo()` comparison function too
- **Server vs Client**: Check for `"use client"` at top before adding hooks
- **Logo filter**: Always use this exact CSS filter for the WFO logo color:
  ```
  filter: brightness(0) saturate(100%) invert(68%) sepia(75%) saturate(800%) hue-rotate(190deg) brightness(105%) contrast(95%)
  ```

## WFO Customizations

- Logo: `public/images/LogoILike.png` (header, background, auth pages)
- Greeting disabled in `components/greeting.tsx`
- Custom system prompt in `lib/ai/prompts.ts`
