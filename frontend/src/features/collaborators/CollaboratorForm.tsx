import { useState, type FormEvent } from 'react'
import { ApiError } from '../../shared/api/client'
import { maskSalaryInput, parseSalaryMask } from '../../shared/format/currency'
import { createCollaborator } from './api'
import type { CollaboratorFormValues } from './types'
import { validateCollaboratorForm, type FormErrors } from './validate'
import styles from './collaborators.module.css'

type Props = {
  onCreated: (id: string) => void
}

const emptyValues: CollaboratorFormValues = {
  fullName: '',
  jobTitle: '',
  department: '',
  admissionDate: '',
  salaryMask: '',
}

export function CollaboratorForm({ onCreated }: Props) {
  const [values, setValues] = useState<CollaboratorFormValues>(emptyValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof CollaboratorFormValues>(field: K, value: CollaboratorFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateCollaboratorForm(values)
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const salary = parseSalaryMask(values.salaryMask)
    if (salary === null) {
      return
    }

    setSubmitting(true)
    try {
      const created = await createCollaborator({
        fullName: values.fullName.trim(),
        jobTitle: values.jobTitle.trim(),
        department: values.department.trim(),
        admissionDate: values.admissionDate,
        salary,
      })
      setValues(emptyValues)
      onCreated(created.id)
    } catch (error) {
      if (error instanceof ApiError) {
        const mapped: FormErrors = {}
        for (const fieldError of error.fieldErrors) {
          if (fieldError.field === 'salary') {
            mapped.salaryMask = fieldError.message
          } else if (fieldError.field in emptyValues) {
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
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.field}>
        Nome completo
        <input
          value={values.fullName}
          maxLength={255}
          onChange={(event) => update('fullName', event.target.value)}
        />
        {errors.fullName ? <span className={styles.fieldError}>{errors.fullName}</span> : null}
      </label>

      <label className={styles.field}>
        Cargo
        <input
          value={values.jobTitle}
          maxLength={255}
          onChange={(event) => update('jobTitle', event.target.value)}
        />
        {errors.jobTitle ? <span className={styles.fieldError}>{errors.jobTitle}</span> : null}
      </label>

      <label className={styles.field}>
        Setor
        <input
          value={values.department}
          maxLength={255}
          onChange={(event) => update('department', event.target.value)}
        />
        {errors.department ? <span className={styles.fieldError}>{errors.department}</span> : null}
      </label>

      <label className={styles.field}>
        Data de admissão
        <input
          type="date"
          value={values.admissionDate}
          onChange={(event) => update('admissionDate', event.target.value)}
        />
        {errors.admissionDate ? <span className={styles.fieldError}>{errors.admissionDate}</span> : null}
      </label>

      <label className={styles.field}>
        Salário
        <input
          inputMode="numeric"
          placeholder="R$ 0,00"
          value={values.salaryMask}
          onChange={(event) => update('salaryMask', maskSalaryInput(event.target.value))}
        />
        {errors.salaryMask ? <span className={styles.fieldError}>{errors.salaryMask}</span> : null}
      </label>

      {submitError ? <p className={styles.bannerError}>{submitError}</p> : null}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : 'Cadastrar colaborador'}
      </button>
    </form>
  )
}
