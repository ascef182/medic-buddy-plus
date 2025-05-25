
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
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
    render(<Index />)
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('shows welcome message when loaded', async () => {
    render(<Index />)
    
    // Wait for loading to finish and check for main navigation cards
    await screen.findByText('Medicamentos')
    expect(screen.getByText('Consultas')).toBeInTheDocument()
    expect(screen.getByText('Insights')).toBeInTheDocument()
    expect(screen.getByText('Contatos')).toBeInTheDocument()
  })
})
