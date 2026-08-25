
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock do Supabase para os testes
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  },
}))

// Mock do React Router — mantém a implementação real (Link, MemoryRouter,
// BrowserRouter, Navigate, useParams etc.) e só sobrescreve os hooks que
// precisam ser determinísticos em teste (useNavigate/useLocation).
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  }
})
