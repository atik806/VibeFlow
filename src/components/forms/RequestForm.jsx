import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestSchema, defaultRequest } from '../../lib/validation/requestSchema'
import { services } from '../../data/services'
import { Input, Select, Textarea } from '../ui/Field'
import { Button } from '../ui/Button'

const BUDGETS = [
  { value: 'under-10000', label: 'Under ৳10,000' },
  { value: '10000-25000', label: '৳10,000 – ৳25,000' },
  { value: '25000-50000', label: '৳25,000 – ৳50,000' },
  { value: '50000-100000', label: '৳50,000 – ৳1,00,000' },
  { value: '100000-plus', label: '৳1,00,000+' },
]

export function RequestForm({ onSubmit, user }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: user
      ? { ...defaultRequest, name: user.user_metadata?.full_name || '', email: user.email || '' }
      : defaultRequest,
    mode: 'onBlur',
  })

  const selectedService = watch('service')
  const subcategoryOptions =
    services.find((s) => s.title === selectedService)?.subcategories || []

  useEffect(() => {
    setValue('subcategory', '', { shouldValidate: false })
  }, [selectedService, setValue])

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        const enriched = {
          ...values,
          name: user?.user_metadata?.full_name || values.name,
          email: user?.email || values.email,
          user_id: user?.id || undefined,
        }
        await onSubmit?.(enriched)
        reset(user ? { ...defaultRequest, name: user.user_metadata?.full_name || '', email: user.email || '' } : defaultRequest)
      })}
      className="request-form"
      noValidate
    >
      {user ? (
        <div className="field-row">
          <div className="field field-authenticated">
            <label className="field-label">Submitting as</label>
            <p className="field-authenticated-info">
              {user.user_metadata?.full_name || user.email} &lt;{user.email}&gt;
            </p>
          </div>
        </div>
      ) : (
        <div className="field-row">
          <Input
            label="Your Name"
            placeholder="John Doe"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
      )}

      <div className="field-row">
        <Select
          label="Service Category"
          error={errors.service?.message}
          {...register('service')}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.title}>{s.title}</option>
          ))}
        </Select>
        <Select
          label="Subcategory"
          disabled={!selectedService}
          error={errors.subcategory?.message}
          hint={!selectedService ? 'Pick a service first' : undefined}
          {...register('subcategory')}
        >
          <option value="">Select subcategory</option>
          {subcategoryOptions.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Project Description"
        placeholder="Goals, audience, references, deadlines — more context = better results."
        rows={5}
        error={errors.description?.message}
        hint="At least 20 characters. The more detail the better."
        {...register('description')}
      />

      <Select
        label="Budget Range (BDT)"
        error={errors.budget?.message}
        {...register('budget')}
      >
        <option value="">Select budget range</option>
        {BUDGETS.map((b) => (
          <option key={b.value} value={b.value}>{b.label}</option>
        ))}
      </Select>

      <Button type="submit" variant="primary" block loading={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Submit Request'}
      </Button>
    </form>
  )
}
