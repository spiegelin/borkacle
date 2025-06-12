"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  PieChart,
  Pie,
  Cell
} from "recharts"
import api from "@/lib/api"
import { useAuth } from "@/components/auth/AuthContext"

interface SprintData {
  sprintId: number
  sprintNombre: string
  horasEstimadas: number
  horasReales: number
  tareasCompletadas: number
  tareasTotales: number
  eficiencia: number
}

interface KpiPersonaData {
  usuarioId: number
  usuarioNombre: string
  sprints: SprintData[]
}

interface KpiPersonaDashboardProps {
  individualUserView?: boolean;
  userId?: number;
}

export function KpiPersonaDashboard({ individualUserView = false, userId }: KpiPersonaDashboardProps) {
  const [kpiData, setKpiData] = useState<KpiPersonaData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeUser, setActiveUser] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [view, setView] = useState<"team" | "person">("person")
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // No hacer petición si no hay usuario autenticado
      
      setLoading(true)
      setError(null)
      setErrorDetails(null)
      
      try {
        console.log("Iniciando solicitud de KPI por persona")
        
        // Aumentar el timeout a 60 segundos
        const response = await api.get('/api/kpi/persona', {
          timeout: 60000 // 60 segundos
        })
        
        console.log("Respuesta recibida:", response)
        let data = response.data
        
        // Filter data if in individual view mode
        if (individualUserView && userId) {
          data = data.filter((item: KpiPersonaData) => item.usuarioId === userId)
        }
        
        setKpiData(data)
        if (data.length > 0 && !activeUser) {
          setActiveUser(data[0].usuarioNombre)
        }
      } catch (err: any) {
        console.error("Error al obtener datos KPI:", err)
        
        if (err.code === 'ECONNABORTED') {
          setError("La solicitud está tomando demasiado tiempo. Por favor, intente nuevamente.")
          setErrorDetails("Timeout de la petición. El servidor puede estar sobrecargado o la conexión es lenta.")
        } else if (err.response) {
          setError("Error del servidor al obtener datos KPI")
          setErrorDetails(JSON.stringify(err.response.data, null, 2))
        } else if (err.request) {
          setError("No se recibió respuesta del servidor")
          setErrorDetails("El servidor no está respondiendo. Por favor, verifique su conexión e intente nuevamente.")
        } else {
          setError("Error al obtener datos KPI")
          setErrorDetails(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, individualUserView, userId])

  // Función para recargar los datos con retry
  const handleRefresh = async () => {
    setActiveUser(null) // Reset active user to force a new fetch
    setKpiData([]) // Clear existing data
    setLoading(true)
    setError(null)
    setErrorDetails(null)
    
    try {
      const response = await api.get('/api/kpi/persona', {
        timeout: 60000 // 60 segundos
      })
      
      let data = response.data
      if (individualUserView && userId) {
        data = data.filter((item: KpiPersonaData) => item.usuarioId === userId)
      }
      
      setKpiData(data)
      if (data.length > 0) {
        setActiveUser(data[0].usuarioNombre)
      }
    } catch (err: any) {
      console.error("Error al recargar datos KPI:", err)
      if (err.code === 'ECONNABORTED') {
        setError("La solicitud está tomando demasiado tiempo. Por favor, intente nuevamente.")
      } else {
        setError("Error al recargar los datos")
      }
    } finally {
      setLoading(false)
    }
  }

  const getUserData = () => {
    if (!activeUser) return null
    return kpiData.find(user => user.usuarioNombre === activeUser)
  }

  const formatSprintData = (sprints: SprintData[]) => {
    return sprints.map(sprint => ({
      name: sprint.sprintNombre,
      Estimadas: sprint.horasEstimadas,
      Reales: sprint.horasReales,
      Eficiencia: Math.round(sprint.eficiencia),
      TareasCompletadas: sprint.tareasCompletadas,
      TotalTareas: sprint.tareasTotales,
      ProgresoTareas: sprint.tareasTotales > 0 
        ? Math.round((sprint.tareasCompletadas / sprint.tareasTotales) * 100) 
        : 0
    }))
  }

  const userData = getUserData()
  const chartData = userData ? formatSprintData(userData.sprints) : []
  
  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#3498DB', '#2ECC71', '#F1C40F'];

  const renderCharts = () => {
    if (!kpiData || kpiData.length === 0) return null;

    // Preparar datos para la gráfica de comparación global
    const globalComparisonData = kpiData.map(user => {
      const totalEstimadas = user.sprints.reduce((sum, sprint) => sum + sprint.horasEstimadas, 0);
      const totalReales = user.sprints.reduce((sum, sprint) => sum + sprint.horasReales, 0);
      return {
        usuario: user.usuarioNombre,
        estimadas: totalEstimadas,
        reales: totalReales
      };
    });

    return (
      <div className="space-y-6">
        {/* Gráfica de comparación global */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparación Global de Horas Estimadas vs Reales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={globalComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="usuario" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="estimadas" name="Horas Estimadas" fill="#8884d8" />
                <Bar dataKey="reales" name="Horas Reales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficas existentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfica de Eficiencia */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiencia por Sprint</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={kpiData.find(k => k.usuarioNombre === activeUser)?.sprints || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprintNombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="eficiencia" name="Eficiencia (%)" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica de Tareas Completadas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas Completadas vs Totales</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kpiData.find(k => k.usuarioNombre === activeUser)?.sprints || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprintNombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tareasCompletadas" name="Tareas Completadas" fill="#8884d8" />
                  <Bar dataKey="tareasTotales" name="Tareas Totales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando datos KPI de personas...</p>
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
                <Button onClick={() => window.location.reload()}>
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
        <h2 className="text-3xl font-bold tracking-tight">
          {individualUserView ? "Mi KPI Individual" : "KPI por Persona"}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {kpiData.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
              <p className="text-muted-foreground">
                {individualUserView 
                  ? "No se encontraron datos KPI para tu usuario." 
                  : "No se encontraron personas o sprints para mostrar estadísticas KPI."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {!individualUserView && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Seleccionar Persona</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={activeUser || ''}
                    onValueChange={(value) => setActiveUser(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {kpiData.map((user) => (
                        <SelectItem key={user.usuarioId} value={user.usuarioNombre}>
                          {user.usuarioNombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          )}

          {userData && (
            <Tabs defaultValue="global" className="space-y-4">
              <TabsList>
                <TabsTrigger value="global">Vista Global</TabsTrigger>
                <TabsTrigger value="individual">Vista Individual</TabsTrigger>
              </TabsList>
              
              <TabsContent value="global">
                {renderCharts()}
              </TabsContent>
              
              <TabsContent value="individual">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Horas Estimadas vs Reales</CardTitle>
                      <CardDescription>Comparación de horas por sprint</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Estimadas" fill="#8884d8" />
                            <Bar dataKey="Reales" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Eficiencia</CardTitle>
                      <CardDescription>Porcentaje de eficiencia por sprint</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Eficiencia" stroke="#8884d8" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progreso de Tareas</CardTitle>
                      <CardDescription>Tareas completadas vs totales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="TareasCompletadas" fill="#8884d8" />
                            <Bar dataKey="TotalTareas" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progreso de Tareas por Sprint</CardTitle>
                      <CardDescription>Tareas completadas en cada sprint</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        {(() => {
                          const pieData = userData && userData.sprints
                            ? userData.sprints.map(sprint => ({
                                name: sprint.sprintNombre,
                                value: sprint.tareasCompletadas
                              }))
                            : [];
                          console.log("PieChart data:", pieData);
                          return pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  outerRadius={120}
                                  fill="#8884d8"
                                  dataKey="value"
                                  nameKey="name"
                                  label={({ name, value }) => `${name}: ${value}`}
                                  paddingAngle={2}
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value: number) => [`${value} tareas`, '']}
                                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                                />
                                <Legend 
                                  verticalAlign="bottom" 
                                  height={36}
                                  formatter={(value) => <span style={{ color: '#666' }}>{value}</span>}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-gray-500">No hay datos disponibles</p>
                            </div>
                          );
                        })()}
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