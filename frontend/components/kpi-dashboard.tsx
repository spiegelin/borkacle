"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  TooltipProps,
  PieChart,
  Pie,
  Cell
} from "recharts"
import api from "@/lib/api"

interface SprintData {
  sprintId: number
  sprintNombre: string
  horasEstimadas: number
  horasReales: number
  tareasCompletadas: number
  tareasTotales: number
}

interface KpiData {
  equipoId: number
  equipoNombre: string
  sprints: SprintData[]
}

export function KpiDashboard() {
  const [kpiData, setKpiData] = useState<KpiData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTeam, setActiveTeam] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  useEffect(() => {
    fetchKpiData()
  }, [])

  const fetchKpiData = async () => {
    setLoading(true)
    setError(null)
    setErrorDetails(null)
    
    try {
      console.log("Iniciando solicitud de KPI")
      
      // La instancia api ya tiene configurada la URL base, usamos la ruta relativa
      const response = await api.get('/api/kpi')
      console.log("Respuesta recibida:", response)
      const data = response.data
      
      setKpiData(data)
      if (data.length > 0) {
        setActiveTeam(data[0].equipoNombre)
      }
    } catch (err: any) {
      console.error('Error fetching KPI data:', err)
      
      // Capturar detalles específicos del error para depuración
      let errorMessage = 'No se pudieron cargar los datos KPI. Por favor, intente nuevamente.'
      let details = ''
      
      if (err.response) {
        // Error con respuesta del servidor
        details = `Código de error: ${err.response.status}, Mensaje: ${JSON.stringify(err.response.data)}`
        if (err.response.status === 401) {
          errorMessage = 'Error de autenticación. Por favor, inicie sesión nuevamente.'
        } else if (err.response.status === 403) {
          errorMessage = 'No tiene permisos para acceder a estos datos.'
        } else if (err.response.status === 404) {
          errorMessage = 'El servicio de KPI no está disponible en esta ruta.'
        } else if (err.response.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor, intente más tarde.'
        }
      } else if (err.request) {
        // Error sin respuesta del servidor (problemas de red)
        details = 'No se obtuvo respuesta del servidor. Verifique su conexión de red.'
        errorMessage = 'No se pudo conectar al servidor. Verifique su conexión de red.'
      } else {
        // Error en la configuración de la solicitud
        details = `Error de configuración: ${err.message}`
      }
      
      setError(errorMessage)
      setErrorDetails(details)
    } finally {
      setLoading(false)
    }
  }

  const getTeamData = () => {
    if (!activeTeam) return null
    return kpiData.find(team => team.equipoNombre === activeTeam)
  }

  const formatSprintData = (sprints: SprintData[]) => {
    return sprints.map(sprint => ({
      name: sprint.sprintNombre,
      Estimadas: sprint.horasEstimadas,
      Reales: sprint.horasReales,
      Eficiencia: sprint.horasEstimadas > 0 
        ? Math.round((sprint.horasEstimadas / sprint.horasReales) * 100) 
        : 0,
      TareasCompletadas: sprint.tareasCompletadas,
      TotalTareas: sprint.tareasTotales,
      ProgresoTareas: sprint.tareasTotales > 0 
        ? Math.round((sprint.tareasCompletadas / sprint.tareasTotales) * 100) 
        : 0
    }))
  }

  const teamData = getTeamData()
  const chartData = teamData ? formatSprintData(teamData.sprints) : []
  
  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#3498DB', '#2ECC71', '#F1C40F'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando datos KPI...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Error</h3>
              <p className="text-muted-foreground">{error}</p>
              {errorDetails && (
                <div className="mt-4 p-2 bg-gray-100 rounded text-left text-xs overflow-auto max-h-40">
                  <code>{errorDetails}</code>
                </div>
              )}
              <div className="flex justify-center mt-4">
                <Button onClick={fetchKpiData} className="mr-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Recargar página
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">KPI Dashboard</h2>
        <Button variant="outline" size="sm" onClick={fetchKpiData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar datos
        </Button>
      </div>

      {kpiData.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
              <p className="text-muted-foreground">No se encontraron equipos o sprints para mostrar estadísticas KPI.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Equipos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {kpiData.map((team) => (
                    <Button
                      key={team.equipoId}
                      variant={activeTeam === team.equipoNombre ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTeam(team.equipoNombre)}
                    >
                      {team.equipoNombre}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {teamData && (
            <Tabs defaultValue="hours" className="space-y-4">
              <TabsList>
                <TabsTrigger value="hours">Horas Estimadas vs Reales</TabsTrigger>
                <TabsTrigger value="tasks">Tareas Completadas</TabsTrigger>
                <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
                <TabsTrigger value="summary">Resumen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hours" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Horas Estimadas vs Reales por Sprint</CardTitle>
                    <CardDescription>
                      Comparación de horas estimadas y reales para el equipo {activeTeam}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <Tooltip formatter={(value: number) => [`${value} horas`, '']} />
                          <Legend />
                          <Bar dataKey="Estimadas" fill="#8884d8" name="Horas Estimadas" />
                          <Bar dataKey="Reales" fill="#82ca9d" name="Horas Reales" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tareas Completadas por Sprint</CardTitle>
                    <CardDescription>
                      Progreso de tareas completadas vs totales para el equipo {activeTeam}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="TareasCompletadas" fill="#8884d8" name="Tareas Completadas" />
                          <Bar dataKey="TotalTareas" fill="#82ca9d" name="Total Tareas" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="efficiency" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Eficiencia por Sprint</CardTitle>
                    <CardDescription>
                      Porcentaje de eficiencia para el equipo {activeTeam}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                          <YAxis domain={[0, 150]} />
                          <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="Eficiencia" 
                            stroke="#8884d8" 
                            name="Eficiencia (Estimado/Real %)" 
                            dot={{ r: 5 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ProgresoTareas" 
                            stroke="#82ca9d" 
                            name="Progreso Tareas (%)" 
                            dot={{ r: 5 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución de Tareas</CardTitle>
                      <CardDescription>
                        Completadas vs. Pendientes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Completadas', value: teamData.sprints.reduce((acc, sprint) => acc + sprint.tareasCompletadas, 0) },
                                { name: 'Pendientes', value: teamData.sprints.reduce((acc, sprint) => acc + (sprint.tareasTotales - sprint.tareasCompletadas), 0) }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {[0, 1].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`${value} tareas`, '']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución de Horas</CardTitle>
                      <CardDescription>
                        Estimadas vs. Reales
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Estimadas', value: teamData.sprints.reduce((acc, sprint) => acc + sprint.horasEstimadas, 0) },
                                { name: 'Reales', value: teamData.sprints.reduce((acc, sprint) => acc + sprint.horasReales, 0) }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, value }) => `${name}: ${value} hrs`}
                            >
                              {[0, 1].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`${value} horas`, '']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Estadísticas Generales</CardTitle>
                      <CardDescription>
                        Resumen de KPIs para el equipo {activeTeam}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Total Tareas</div>
                          <div className="text-2xl font-bold">
                            {teamData.sprints.reduce((acc, sprint) => acc + sprint.tareasTotales, 0)}
                          </div>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Tareas Completadas</div>
                          <div className="text-2xl font-bold">
                            {teamData.sprints.reduce((acc, sprint) => acc + sprint.tareasCompletadas, 0)}
                          </div>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Horas Estimadas</div>
                          <div className="text-2xl font-bold">
                            {teamData.sprints.reduce((acc, sprint) => acc + sprint.horasEstimadas, 0)}
                          </div>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Horas Reales</div>
                          <div className="text-2xl font-bold">
                            {teamData.sprints.reduce((acc, sprint) => acc + sprint.horasReales, 0)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  )
} 