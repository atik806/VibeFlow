import { z } from 'zod'
import { services } from '../../data/services'

const categoryTitles = services.map((s) => s.title)

export const requestSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Please enter your full name.')
      .max(80, 'Name is too long.'),
    email: z.string().email('Enter a valid email address.'),
    service: z
      .string()
      .refine((v) => categoryTitles.includes(v), 'Select a service category.'),
    subcategory: z.string().min(1, 'Select a subcategory.'),
    description: z
      .string()
      .min(20, 'Please give us at least 20 characters of detail.')
      .max(2000, 'Please keep it under 2000 characters.'),
    budget: z.enum(['under-500', '500-1000', '1000-2500', '2500-5000', '5000+'], {
      message: 'Select a budget range.',
    }),
  })
  .superRefine((data, ctx) => {
    const cat = services.find((s) => s.title === data.service)
    if (cat && !cat.subcategories.includes(data.subcategory)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['subcategory'],
        message: 'Pick a subcategory that belongs to the selected service.',
      })
    }
  })

export const defaultRequest = {
  name: '',
  email: '',
  service: '',
  subcategory: '',
  description: '',
  budget: '',
}
