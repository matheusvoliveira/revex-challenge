import { useEffect, useState, type FormEvent } from 'react'
import { ApiError } from '../../shared/api/client'
import { Banner } from '../../shared/ui/Banner'
import { Button } from '../../shared/ui/Button'
import { Card } from '../../shared/ui/Card'
import { SelectField } from '../../shared/ui/SelectField'
import { TextField } from '../../shared/ui/TextField'
import { listCollaborators } from '../collaborators/api'
import type { CollaboratorSummary } from '../collaborators/types'
import { createActivity } from './api'
import type { ActivityFormValues } from './types'
import { validateActivityForm, type ActivityFormErrors } from './validate'
import styles from './activities.module.css'

type Props = {
  onCreated: () => void
}

const emptyValues: ActivityFormValues = {
  title: '',
  description: '',
  collaboratorId: '',
}

export function ActivityForm({ onCreated }: Props) {
  const [values, setValues] = useState<ActivityFormValues>(emptyValues)
  const [errors, setErrors] = useState<ActivityFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [collaborators, setCollaborators] = useState<CollaboratorSummary[] | null>(null)
  const [optionsError, setOptionsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void listCollaborators()
      .then((page) => {
        if (!cancelled) {
          setCollaborators(page.content)
        }
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return
        }
        setOptionsError(
          cause instanceof ApiError
            ? cause.message
            : 'Não foi possível carregar os colaboradores.'
        )
      })
    return () => {
      cancelled = true
    }
  }, [])

  function update<K extends keyof ActivityFormValues>(field: K, value: ActivityFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateActivityForm(values)
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      await createActivity({
        title: values.title.trim(),
        description: values.description.trim(),
        collaboratorId: values.collaboratorId,
      })
      setValues(emptyValues)
      onCreated()
    } catch (error) {
      if (error instanceof ApiError) {
        const mapped: ActivityFormErrors = {}
        for (const fieldError of error.fieldErrors) {
          if (fieldError.field === 'title' || fieldError.field === 'description' || fieldError.field === 'collaboratorId') {
            mapped[fieldError.field] = fieldError.message
          }
        }
        setErrors(mapped)
        setSubmitError(error.message)
      } else {
        setSubmitError('Não foi possível salvar a atividade. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const loadingOptions = collaborators === null && optionsError === null
  const hasCollaborators = (collaborators?.length ?? 0) > 0

  return (
    <Card>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Título"
          value={values.title}
          maxLength={100}
          onChange={(event) => update('title', event.target.value)}
          error={errors.title}
        />
        <TextField
          label="Descrição"
          multiline
          value={values.description}
          maxLength={1000}
          rows={4}
          onChange={(event) => update('description', event.target.value)}
          error={errors.description}
        />
        <SelectField
          label="Colaborador"
          value={values.collaboratorId}
          disabled={loadingOptions || !hasCollaborators}
          onChange={(event) => update('collaboratorId', event.target.value)}
          error={errors.collaboratorId}
        >
          <option value="">
            {loadingOptions ? 'Carregando colaboradores...' : 'Selecione um colaborador'}
          </option>
          {(collaborators ?? []).map((collaborator) => (
            <option key={collaborator.id} value={collaborator.id}>
              {collaborator.fullName}
            </option>
          ))}
        </SelectField>
        {optionsError ? <Banner>{optionsError}</Banner> : null}
        {!loadingOptions && !optionsError && !hasCollaborators ? (
          <Banner tone="info">
            Cadastre um colaborador antes de criar atividades.{' '}
            <Button to="/collaborators/new" variant="ghost">Novo colaborador</Button>
          </Banner>
        ) : null}
        {submitError ? <Banner>{submitError}</Banner> : null}
        <Button type="submit" disabled={submitting || !hasCollaborators}>
          {submitting ? 'Salvando...' : 'Cadastrar atividade'}
        </Button>
      </form>
    </Card>
  )
}
