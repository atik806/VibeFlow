import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestSchema, defaultRequest } from '../../lib/validation/requestSchema'
import { services } from '../../data/services'
import { Input, Select, Textarea } from '../ui/Field'
import { Button } from '../ui/Button'

const BUDGETS = [
  { value: 'under-500', label: 'Under $500' },
  { value: '500-1000', label: '$500 – $1,000' },
  { value: '1000-2500', label: '$1,000 – $2,500' },
  { value: '2500-5000', label: '$2,500 – $5,000' },
  { value: '5000+', label: '$5,000+' },
]

export function RequestForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: defaultRequest,
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
        await onSubmit?.(values)
        reset(defaultRequest)
      })}
      className="request-form"
      noValidate
    >
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
        label="Budget Range (USD)"
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
