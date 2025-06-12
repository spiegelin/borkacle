import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import image from "@/public/oracle.jpg"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-[#C74634] flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <div className="font-semibold text-xl text-[#3A3A3A]">Oracle Cloud Tasks</div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" passHref>
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button className="bg-[#C74634] hover:bg-[#b03d2e]">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#3A3A3A] leading-tight">
                Gestiona tus proyectos con facilidad usando Oracle Cloud Tasks
              </h1>
              <p className="text-lg text-gray-600">
                Una potente herramienta de gestión de proyectos diseñada para que los equipos realicen seguimiento de tareas, gestionen sprints y entreguen proyectos a tiempo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" passHref>
                  <Button size="lg" className="bg-[#C74634] hover:bg-[#b03d2e]">
                    Comenzar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features" passHref>
                  <Button size="lg" variant="outline">
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                <img
                  src={image.src}
                  alt="Panel de Control de Oracle Cloud Tasks"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#3A3A3A]">Características Potentes para tu Equipo</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar proyectos, hacer seguimiento del progreso y colaborar con tu equipo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-[#C74634] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-layout-dashboard"
                >
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Tablero Kanban</h3>
              <p className="text-gray-600">
                Visualiza tu flujo de trabajo con tableros personalizables. Arrastra y suelta tareas para actualizar su estado.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-[#1A4F9C] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-timer"
                >
                  <path d="M10 2h4" />
                  <path d="M12 14v-4" />
                  <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
                  <path d="M9 17H4v5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Gestión de Sprints</h3>
              <p className="text-gray-600">
                Planifica y realiza seguimiento de sprints con facilidad. Establece objetivos, asigna tareas y monitorea el progreso en tiempo real.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bar-chart-3"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Informes Avanzados</h3>
              <p className="text-gray-600">
                Obtén información sobre el rendimiento de tu equipo con informes detallados y análisis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#3A3A3A] mb-6">¿Listo para optimizar tu gestión de proyectos?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a miles de equipos que utilizan Oracle Cloud Tasks para entregar proyectos a tiempo y dentro del presupuesto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" passHref>
              <Button size="lg" className="bg-[#C74634] hover:bg-[#b03d2e]">
                Prueba Gratuita
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button size="lg" variant="outline">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3A3A3A] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-md bg-[#C74634] flex items-center justify-center text-white font-bold">
                  O
                </div>
                <div className="font-semibold text-white">Oracle Cloud Tasks</div>
              </div>
              <p className="text-gray-300">
                Una potente herramienta de gestión de proyectos diseñada para que los equipos realicen seguimiento de tareas, gestionen sprints y entreguen proyectos a tiempo.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Integraciones
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Hoja de Ruta
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Tutoriales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Soporte
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Carreras
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Prensa
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>&copy; 2023 Oracle Cloud Tasks. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

