import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { KpiDashboard } from '@/components/kpi-dashboard'
import api from '@/lib/api'

// Mock the API module
jest.mock('@/lib/api', () => ({
  get: jest.fn()
}))

describe('KpiDashboard Component', () => {
  const mockKpiData = [
    {
      equipoId: 1,
      equipoNombre: 'Team Alpha',
      sprints: [
        {
          sprintId: 1,
          sprintNombre: 'Sprint 1',
          horasEstimadas: 100,
          horasReales: 120,
          tareasCompletadas: 8,
          tareasTotales: 10
        },
        {
          sprintId: 2,
          sprintNombre: 'Sprint 2',
          horasEstimadas: 150,
          horasReales: 140,
          tareasCompletadas: 12,
          tareasTotales: 15
        }
      ]
    },
    {
      equipoId: 2,
      equipoNombre: 'Team Beta',
      sprints: [
        {
          sprintId: 1,
          sprintNombre: 'Sprint 1',
          horasEstimadas: 80,
          horasReales: 90,
          tareasCompletadas: 6,
          tareasTotales: 8
        }
      ]
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(api.get as jest.Mock).mockResolvedValue({
      data: mockKpiData
    })
  })

  it('should render loading state initially', () => {
    render(<KpiDashboard />)
    expect(screen.getByText('Cargando datos KPI...')).toBeInTheDocument()
  })

  it('should fetch and display team KPIs', async () => {
    render(<KpiDashboard />)
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/kpi')
      expect(screen.getByText('Team Alpha')).toBeInTheDocument()
      expect(screen.getByText('Team Beta')).toBeInTheDocument()
    })
  })

  it('should display correct metrics for selected team', async () => {
    render(<KpiDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Team Alpha')).toBeInTheDocument()
    })

    // Verify metrics are displayed correctly
    expect(screen.getByText('Total de equipos')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Total teams
    expect(screen.getByText('20')).toBeInTheDocument() // Total completed tasks
    expect(screen.getByText('83%')).toBeInTheDocument() // Average efficiency
  })

  it('should switch between different views (hours, tasks, efficiency)', async () => {
    render(<KpiDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Team Alpha')).toBeInTheDocument()
    })

    // Switch to tasks view
    fireEvent.click(screen.getByText('Tareas Completadas'))
    expect(screen.getByText('Tareas Completadas por Sprint')).toBeInTheDocument()

    // Switch to efficiency view
    fireEvent.click(screen.getByText('Eficiencia'))
    expect(screen.getByText('Eficiencia por Sprint')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    ;(api.get as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<KpiDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar los datos KPI. Por favor, intente nuevamente.')).toBeInTheDocument()
    })

    // Test retry functionality
    const retryButton = screen.getByText('Reintentar')
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2)
    })
  })

  it('should display correct charts for team metrics', async () => {
    render(<KpiDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Team Alpha')).toBeInTheDocument()
    })

    // Verify charts are present
    expect(screen.getByText('Horas Estimadas vs Reales por Sprint')).toBeInTheDocument()
    expect(screen.getByText('Tareas Completadas por Sprint')).toBeInTheDocument()
    expect(screen.getByText('Eficiencia por Sprint')).toBeInTheDocument()
  })
}) 