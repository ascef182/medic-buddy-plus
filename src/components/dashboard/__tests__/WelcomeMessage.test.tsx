
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { describe, it, expect } from 'vitest'
import WelcomeMessage from '../WelcomeMessage'

describe('WelcomeMessage', () => {
  it('renders welcome message for user without patients', () => {
    render(<WelcomeMessage userName="João" hasPatients={false} />)
    
    expect(screen.getByText('Bem-vindo(a), João!')).toBeInTheDocument()
    expect(screen.getByText('Adicionar Primeiro Paciente')).toBeInTheDocument()
  })

  it('renders different message when user has patients', () => {
    render(<WelcomeMessage userName="Maria" hasPatients={true} />)
    
    expect(screen.getByText('Bem-vindo(a), Maria!')).toBeInTheDocument()
    expect(screen.queryByText('Adicionar Primeiro Paciente')).not.toBeInTheDocument()
  })
})
