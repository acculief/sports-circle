import { z } from 'zod'

const CONTACT_PATTERN = /line\.me|@[a-z0-9]+|twitter\.com|instagram\.com|tiktok\.com/i

export const postSchema = z.object({
  title: z.string().min(5, '5文字以上入力してください').max(100, '100文字以内で入力してください'),
  description: z.string().min(50, '50文字以上入力してください').max(5000)
    .refine((v) => !CONTACT_PATTERN.test(v), {
      message: '外部連絡先（LINE・SNS等）の記載は禁止されています',
    }),
  sportId: z.string().min(1, 'スポーツを選択してください'),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  city: z.string().optional(),
  placeText: z.string().max(200).optional(),
  skillLevel: z.enum(['beginner', 'any', 'experienced']).default('any'),
  vibe: z.enum(['casual', 'standard', 'serious']).default('standard'),
  genderMix: z.enum(['any', 'male', 'female', 'mixed']).default('any'),
  ageBand: z.enum(['any', '20s', '30s', '40s', '50plus']).default('any'),
  feeMin: z.number().min(0).optional().nullable(),
  feeMax: z.number().min(0).optional().nullable(),
  scheduleText: z.string().max(200).optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).default([]),
  timeBand: z.enum(['morning', 'afternoon', 'evening', 'night', 'any']).default('any'),
  capacityText: z.string().max(100).optional(),
  requirementsText: z.string().max(300).optional(),
})

export type PostFormValues = z.infer<typeof postSchema>

export const messageSchema = z.object({
  body: z.string().min(1, 'メッセージを入力してください').max(2000).refine(
    (v) => !CONTACT_PATTERN.test(v),
    { message: '外部連絡先の記載は禁止されています' }
  ),
})

export const reportSchema = z.object({
  targetType: z.enum(['post', 'user', 'message']),
  targetId: z.string().min(1),
  reason: z.enum(['spam', 'scam', 'harassment', 'illegal', 'other']),
  detail: z.string().max(1000).optional(),
})
