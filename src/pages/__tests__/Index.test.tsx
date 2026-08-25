
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Index from '../Index'

// Mock dos contexts necessários
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}))

vi.mock('@/context/MedicationContext', () => ({
  useMedication: () => ({
    patientProfile: null
  })
}))

// Mock do Layout
vi.mock('@/components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}))

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    )

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('shows welcome message when loaded', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    )

    // The mocked Supabase client (src/test/setup.ts) never resolves any
    // patients, so the component correctly takes the "no patients yet"
    // branch and renders WelcomeMessage — this asserts on that, not on the
    // nav-card grid (which only renders once totalPatients > 0).
    await screen.findByText(/Bem-vindo\(a\) ao BuddyDoctor/)
    expect(screen.getByText('Adicionar Primeiro Paciente')).toBeInTheDocument()
  })
})
