import { Link, useNavigate } from 'react-router-dom'
import { ActivityForm } from './ActivityForm'
import styles from './activities.module.css'

export function ActivityCreatePage() {
  const navigate = useNavigate()

  return (
    <section>
      <p>
        <Link to="/activities">Voltar à lista</Link>
      </p>
      <h1>Nova atividade</h1>
      <p className={styles.hint}>A atividade nasce pendente e fica associada a um colaborador.</p>
      <ActivityForm onCreated={() => navigate('/activities')} />
    </section>
  )
}
