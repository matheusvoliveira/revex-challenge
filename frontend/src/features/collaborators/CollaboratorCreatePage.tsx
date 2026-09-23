import { Link, useNavigate } from 'react-router-dom'
import { CollaboratorForm } from './CollaboratorForm'
import styles from './collaborators.module.css'

export function CollaboratorCreatePage() {
  const navigate = useNavigate()

  return (
    <section>
      <p>
        <Link to="/">Voltar à lista</Link>
      </p>
      <h1>Novo colaborador</h1>
      <p className={styles.hint}>O salário é digitado em reais e enviado à API como número (ex.: 1234.56).</p>
      <CollaboratorForm onCreated={() => navigate('/')} />
    </section>
  )
}
