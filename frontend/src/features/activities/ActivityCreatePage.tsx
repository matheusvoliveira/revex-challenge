import { useNavigate } from 'react-router-dom'
import { Button } from '../../shared/ui/Button'
import { PageHeader } from '../../shared/ui/PageHeader'
import { ActivityForm } from './ActivityForm'

export function ActivityCreatePage() {
  const navigate = useNavigate()

  return (
    <section>
      <PageHeader
        eyebrow="Operação"
        title="Nova atividade"
        description="A atividade nasce pendente e fica associada a um colaborador."
        action={<Button to="/activities" variant="ghost">Voltar à lista</Button>}
      />
      <ActivityForm onCreated={() => navigate('/activities')} />
    </section>
  )
}
