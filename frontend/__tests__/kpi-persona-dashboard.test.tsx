import { render, screen, waitFor, act } from '@testing-library/react'
import { KpiPersonaDashboard } from '../components/kpi-persona-dashboard'
import api from '../lib/api'
import { useAuth } from '../components/auth/AuthContext'
import userEvent from '@testing-library/user-event'

// Mock the API module
jest.mock('../lib/api', () => ({
  get: jest.fn()
}))

// Mock the auth context
jest.mock('../components/auth/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      name: 'Test User'
    }
  })
}))

describe('KpiPersonaDashboard Component', () => {
  const mockKpiData = {
    data: [
      {
        usuarioId: 1,
        usuarioNombre: 'John Doe',
        sprints: [
          {
            sprintId: 1,
            sprintNombre: 'Sprint 1',
            horasEstimadas: 40,
            horasReales: 45,
            tareasCompletadas: 4,
            tareasTotales: 5,
            eficiencia: 89
          }
        ]
      },
      {
        usuarioId: 2,
        usuarioNombre: 'Jane Smith',
        sprints: [
          {
            sprintId: 1,
            sprintNombre: 'Sprint 1',
            horasEstimadas: 35,
            horasReales: 40,
            tareasCompletadas: 3,
            tareasTotales: 4,
            eficiencia: 88
          }
        ]
      }
    ]
  }

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    // Setup default mock implementation
    api.get.mockResolvedValue(mockKpiData)
  })

  it('should render loading state initially', () => {
    render(<KpiPersonaDashboard />)
    expect(screen.getByText('Cargando datos KPI de personas...')).toBeInTheDocument()
  })

  it('should fetch and display KPI data', async () => {
    render(<KpiPersonaDashboard />)
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/kpi/persona')
    })

    // Wait for the data to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    })

    // Open the select dropdown
    const selectButton = screen.getByRole('combobox')
    await act(async () => {
      userEvent.click(selectButton)
    })

    // Check if both users are in the dropdown
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument()
      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument()
    })
  })

  it('should display correct metrics for selected user', async () => {
    render(<KpiPersonaDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    })

    // Verify metrics are displayed in the chart title
    await waitFor(() => {
      expect(screen.getByText(/Horas Estimadas vs Reales por Sprint/)).toBeInTheDocument()
      expect(screen.getByText(/Comparación de horas estimadas y reales para John Doe/)).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    api.get.mockRejectedValueOnce(new Error('Network error'))
    
    render(<KpiPersonaDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar los datos KPI')).toBeInTheDocument()
    })

    // Test retry functionality
    const retryButton = screen.getByText('Reintentar')
    await act(async () => {
      userEvent.click(retryButton)
    })

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2)
    })
  })

  it('should display correct charts', async () => {
    render(<KpiPersonaDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    })

    // Verify chart titles are present
    await waitFor(() => {
      expect(screen.getByText(/Horas Estimadas vs Reales por Sprint/)).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /Tareas Completadas/ })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /Eficiencia/ })).toBeInTheDocument()
    })
  })

  it('should filter data when in individual view mode', async () => {
    render(<KpiPersonaDashboard individualUserView={true} userId={1} />)
    
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument()
      expect(screen.queryByText(/Jane Smith/)).not.toBeInTheDocument()
    })

    // Verify individual view title
    expect(screen.getByText('Mi KPI Individual')).toBeInTheDocument()
  })
}) 