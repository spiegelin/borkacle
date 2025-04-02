import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-[#F7630C] flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <div className="font-semibold text-xl text-[#3A3A3A]">Oracle Cloud Tasks</div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" passHref>
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/" passHref>
              <Button className="bg-[#F7630C] hover:bg-[#E25A00]">Sign Up</Button>
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
                Manage your projects with ease using Oracle Cloud Tasks
              </h1>
              <p className="text-lg text-gray-600">
                A powerful project management tool designed for teams to track tasks, manage sprints, and deliver
                projects on time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" passHref>
                  <Button size="lg" className="bg-[#F7630C] hover:bg-[#E25A00]">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/" passHref>
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Oracle Cloud Tasks Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#3A3A3A]">Powerful Features for Your Team</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage projects, track progress, and collaborate with your team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-[#F7630C] mb-4">
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
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Kanban Board</h3>
              <p className="text-gray-600">
                Visualize your workflow with customizable boards. Drag and drop tasks to update their status.
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
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Sprint Management</h3>
              <p className="text-gray-600">
                Plan and track sprints with ease. Set goals, assign tasks, and monitor progress in real-time.
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
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Advanced Reporting</h3>
              <p className="text-gray-600">
                Get insights into your team's performance with detailed reports and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#3A3A3A] mb-6">Ready to streamline your project management?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teams that use Oracle Cloud Tasks to deliver projects on time and within budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" passHref>
              <Button size="lg" className="bg-[#F7630C] hover:bg-[#E25A00]">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button size="lg" variant="outline">
                Contact Sales
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
                <div className="h-8 w-8 rounded-md bg-[#F7630C] flex items-center justify-center text-white font-bold">
                  O
                </div>
                <div className="font-semibold text-white">Oracle Cloud Tasks</div>
              </div>
              <p className="text-gray-300">
                A powerful project management tool designed for teams to track tasks, manage sprints, and deliver
                projects on time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Oracle Cloud Tasks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

