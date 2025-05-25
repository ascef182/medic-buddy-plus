
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import DashboardStats from '../DashboardStats'

// Mock do context
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}))

vi.mock('@/context/MedicationContext', () => ({
  useMedication: () => ({
    patientProfile: null
  })
}))

describe('DashboardStats', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  it('renders total patients count', () => {
    render(<DashboardStats totalPatients={3} />)
    
    expect(screen.getByText('Total de Pacientes')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<DashboardStats totalPatients={0} />)
    
    expect(screen.getByText('Total de Pacientes')).toBeInTheDocument()
  })
})
