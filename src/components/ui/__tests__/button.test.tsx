
import { render } from '@testing-library/react'
import { screen, fireEvent } from '@testing-library/dom'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Clique aqui</Button>)
    
    expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clique aqui</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Deletar</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('can be disabled', () => {
    render(<Button disabled>Botão Desabilitado</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
