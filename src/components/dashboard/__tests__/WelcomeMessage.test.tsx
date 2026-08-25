
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import WelcomeMessage from '../WelcomeMessage'

describe('WelcomeMessage', () => {
  it('renders welcome message for user without patients', () => {
    render(
      <MemoryRouter>
        <WelcomeMessage userName="João" hasPatients={false} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Bem-vindo(a) ao BuddyDoctor, João!')).toBeInTheDocument()
    expect(screen.getByText('Adicionar Primeiro Paciente')).toBeInTheDocument()
  })

  it('renders different message when user has patients', () => {
    render(
      <MemoryRouter>
        <WelcomeMessage userName="Maria" hasPatients={true} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Bem-vindo(a), Maria!')).toBeInTheDocument()
    expect(screen.queryByText('Adicionar Primeiro Paciente')).not.toBeInTheDocument()
  })
})
