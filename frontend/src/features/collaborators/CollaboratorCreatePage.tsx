import { useNavigate } from 'react-router-dom'
import { Button } from '../../shared/ui/Button'
import { PageHeader } from '../../shared/ui/PageHeader'
import { CollaboratorForm } from './CollaboratorForm'

export function CollaboratorCreatePage() {
  const navigate = useNavigate()

  return (
    <section>
      <PageHeader
        eyebrow="Pessoas"
        title="Novo colaborador"
        description="O salário é digitado em reais e enviado à API como número (ex.: 1234.56)."
        action={<Button to="/collaborators" variant="ghost">Voltar à lista</Button>}
      />
      <CollaboratorForm onSaved={(id) => navigate(`/collaborators/${id}`)} />
    </section>
  )
}
