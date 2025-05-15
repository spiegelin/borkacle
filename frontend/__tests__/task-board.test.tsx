import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import { TaskBoard } from '@/components/task-board'
import api from '@/lib/api'

// Mock the API module
jest.mock('@/lib/api', () => ({
  get: jest.fn(),
  put: jest.fn()
}))

describe('TaskBoard Component', () => {
  const mockTasks = [
    {
      id: 'ORA-1',
      title: 'Test Task 1',
      type: 'task',
      priority: 'medium',
      status: 'todo',
      assignee: {
        name: 'John Doe',
        initials: 'JD'
      }
    },
    {
      id: 'ORA-2',
      title: 'Test Task 2',
      type: 'bug',
      priority: 'high',
      status: 'inProgress',
      assignee: {
        name: 'Jane Smith',
        initials: 'JS'
      }
    }
  ]

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    
    // Mock the API response
    ;(api.get as jest.Mock).mockResolvedValue({
      data: {
        columns: {
          todo: [mockTasks[0]],
          inProgress: [mockTasks[1]]
        }
      }
    })
  })

  it('should render loading state initially', () => {
    render(<TaskBoard />)
    expect(screen.getByText('Cargando tareas...')).toBeInTheDocument()
  })

  it('should fetch and display tasks', async () => {
    render(<TaskBoard />)
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/tareas/board')
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
  })

  it('should handle task status change through drag and drop', async () => {
    render(<TaskBoard />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })

    // Mock the drag end event
    const dragEndEvent = {
      active: { id: 'ORA-1' },
      over: { id: 'ORA-2' }
    }

    // Find the DndContext component
    const dndContext = screen.getByTestId('dnd-context')
    fireEvent.dragEnd(dndContext, dragEndEvent)

    // Verify the API was called with the correct parameters
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/tareas/1/estado', {
        estadoId: expect.any(Number)
      })
    })
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    ;(api.get as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<TaskBoard />)
    
    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar las tareas. Por favor, intenta de nuevo más tarde.')).toBeInTheDocument()
    })

    // Test retry button
    const retryButton = screen.getByText('Reintentar')
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2)
    })
  })

  it('should create a new task', async () => {
    render(<TaskBoard />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })

    // Click new task button
    const newTaskButton = screen.getByText('New Task')
    fireEvent.click(newTaskButton)

    // Verify create task dialog is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
}) 