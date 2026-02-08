# Agent Instructions

## Before Editing

1. Read the file first — don't guess contents
2. Check if component uses `memo()` — you'll need to update the comparison function when adding props

## File Lookup

| Task              | File                                                        |
| ----------------- | ----------------------------------------------------------- |
| Login/Register UI | `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx` |
| Chat header       | `components/chat-header.tsx`                                |
| Message list      | `components/messages.tsx`                                   |
| Input area        | `components/multimodal-input.tsx`                           |
| System prompt     | `lib/ai/prompts.ts`                                         |
| DB queries        | `lib/db/queries.ts`                                         |

## Rules

- Use Tailwind classes for styling (Biome handles formatting)
- Images in `public/` are referenced without the `public` prefix: `src="/images/X.png"`
- Route groups `(auth)` and `(chat)` don't appear in URLs
- Test changes at `http://localhost:3000` — server hot reloads
