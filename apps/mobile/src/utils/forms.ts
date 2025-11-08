import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

// Generic form hook with Zod validation
export function useZodForm(schema: any, defaultValues?: any) {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })
}

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  required: z.string().min(1, 'This field is required'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  url: z.string().url('Invalid URL'),
}

// Form field validation helper
export const validateField = (schema: z.ZodType, value: any) => {
  try {
    schema.parse(value)
    return null
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Validation error'
    }
    return 'Validation error'
  }
}

// Format form errors for display
export const formatFormErrors = (errors: Record<string, any>) => {
  return Object.entries(errors).reduce((acc, [key, error]) => {
    acc[key] = error?.message || `Invalid ${key}`
    return acc
  }, {} as Record<string, string>)
}

// Form submission helper
export const handleFormSubmit = async <T extends FieldValues>(
  formHandler: UseFormReturn<T>,
  onSubmit: (data: T) => Promise<void> | void,
  onError?: (error: Error) => void
) => {
  try {
    const isValid = await formHandler.trigger()
    if (!isValid) return

    const data = formHandler.getValues()
    await onSubmit(data)
    formHandler.reset()
  } catch (error) {
    console.error('Form submission error:', error)
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'))
    }
  }
}
