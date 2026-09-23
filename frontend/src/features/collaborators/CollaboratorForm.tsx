import { useState, type FormEvent } from 'react'
import { ApiError } from '../../shared/api/client'
import { maskSalaryInput, parseSalaryMask } from '../../shared/format/currency'
import { Banner } from '../../shared/ui/Banner'
import { Button } from '../../shared/ui/Button'
import { Card } from '../../shared/ui/Card'
import { TextField } from '../../shared/ui/TextField'
import { createCollaborator, updateCollaborator } from './api'
import type { CollaboratorFormValues } from './types'
import { clampAdmissionDate, todayIso, validateCollaboratorForm, type FormErrors } from './validate'
import styles from './collaborators.module.css'

type Props = {
  initialValues?: CollaboratorFormValues
  collaboratorId?: string
  submitLabel?: string
  onSaved: (id: string) => void
}

function emptyValues(): CollaboratorFormValues {
  return {
    fullName: '',
    jobTitle: '',
    department: '',
    admissionDate: todayIso(),
    salaryMask: '',
  }
}

export function CollaboratorForm({
  initialValues,
  collaboratorId,
  submitLabel = 'Cadastrar colaborador',
  onSaved,
}: Props) {
  const [values, setValues] = useState<CollaboratorFormValues>(() => {
    const seed = initialValues ?? emptyValues()
    return { ...seed, admissionDate: clampAdmissionDate(seed.admissionDate) }
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const admissionDate = clampAdmissionDate(values.admissionDate)

  function update<K extends keyof CollaboratorFormValues>(field: K, value: CollaboratorFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextValues = { ...values, admissionDate }
    const nextErrors = validateCollaboratorForm(nextValues)
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const salary = parseSalaryMask(values.salaryMask)
    if (salary === null) {
      return
    }

    const payload = {
      fullName: values.fullName.trim(),
      jobTitle: values.jobTitle.trim(),
      department: values.department.trim(),
      admissionDate,
      salary,
    }

    setSubmitting(true)
    try {
      const saved = collaboratorId
        ? await updateCollaborator(collaboratorId, payload)
        : await createCollaborator(payload)
      if (!collaboratorId) {
        setValues(emptyValues())
      }
      onSaved(saved.id)
    } catch (error) {
      if (error instanceof ApiError) {
        const mapped: FormErrors = {}
        const fields = emptyValues()
        for (const fieldError of error.fieldErrors) {
          if (fieldError.field === 'salary') {
            mapped.salaryMask = fieldError.message
          } else if (fieldError.field in fields) {
            mapped[fieldError.field as keyof CollaboratorFormValues] = fieldError.message
          }
        }
        setErrors(mapped)
        setSubmitError(error.message)
      } else {
        setSubmitError('Não foi possível salvar o colaborador. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nome completo"
          value={values.fullName}
          maxLength={60}
          onChange={(event) => update('fullName', event.target.value)}
          error={errors.fullName}
        />
        <TextField
          label="Cargo"
          value={values.jobTitle}
          maxLength={30}
          onChange={(event) => update('jobTitle', event.target.value)}
          error={errors.jobTitle}
        />
        <TextField
          label="Setor"
          value={values.department}
          maxLength={30}
          onChange={(event) => update('department', event.target.value)}
          error={errors.department}
        />
        <TextField
          label="Data de admissão"
          type="date"
          max={todayIso()}
          value={admissionDate}
          onChange={(event) => update('admissionDate', clampAdmissionDate(event.target.value))}
          error={errors.admissionDate}
        />
        <TextField
          label="Salário"
          inputMode="numeric"
          placeholder="R$ 0,00"
          value={values.salaryMask}
          onChange={(event) => update('salaryMask', maskSalaryInput(event.target.value))}
          error={errors.salaryMask}
        />
        {submitError ? <Banner>{submitError}</Banner> : null}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : submitLabel}
        </Button>
      </form>
    </Card>
  )
}
