import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, Cloud, Users, Clock, BarChart3 } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-[#F7630C] flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <div className="font-semibold text-xl text-[#3A3A3A]">Oracle Cloud Tasks</div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#3A3A3A] hover:text-[#F7630C] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-[#3A3A3A] hover:text-[#F7630C] transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-[#3A3A3A] hover:text-[#F7630C] transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-[#3A3A3A] hover:text-[#F7630C] transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/" passHref>
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/" passHref>
              <Button className="bg-[#F7630C] hover:bg-[#E25A00]">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-block px-4 py-2 bg-orange-100 text-[#F7630C] rounded-full text-sm font-medium mb-2">
                #1 Project Management Tool for Oracle Cloud
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3A3A3A] leading-tight">
                Manage projects with ease in the cloud
              </h1>
              <p className="text-lg text-gray-600">
                Oracle Cloud Tasks helps teams plan, track, and deliver projects efficiently. Streamline your workflow
                and boost productivity with our intuitive project management solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" passHref>
                  <Button size="lg" className="bg-[#F7630C] hover:bg-[#E25A00]">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works" passHref>
                  <Button size="lg" variant="outline">
                    See How It Works
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/placeholder.svg?height=500&width=700"
                  alt="Oracle Cloud Tasks Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">Trusted by leading companies worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70">
            <img src="/placeholder.svg?height=40&width=120" alt="Company Logo" className="h-8" />
            <img src="/placeholder.svg?height=40&width=120" alt="Company Logo" className="h-8" />
            <img src="/placeholder.svg?height=40&width=120" alt="Company Logo" className="h-8" />
            <img src="/placeholder.svg?height=40&width=120" alt="Company Logo" className="h-8" />
            <img src="/placeholder.svg?height=40&width=120" alt="Company Logo" className="h-8" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#3A3A3A]">Powerful Features for Modern Teams</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage projects, track progress, and collaborate with your team in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-[#F7630C] mb-4">
                <Cloud className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Cloud-Native</h3>
              <p className="text-gray-600">
                Built specifically for Oracle Cloud environments, ensuring seamless integration with your existing
                infrastructure.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-[#1A4F9C] mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Real-time collaboration tools that keep everyone on the same page, no matter where they're working from.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Sprint Management</h3>
              <p className="text-gray-600">
                Plan and track sprints with ease. Set goals, assign tasks, and monitor progress in real-time.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Gain insights into your team's performance with detailed reports and customizable dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#3A3A3A]">How Oracle Cloud Tasks Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              A simple, intuitive workflow designed to help your team deliver projects efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-[#F7630C] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Create Projects</h3>
              <p className="text-gray-600">
                Set up your project, define goals, and invite team members to collaborate.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-[#F7630C] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Plan & Assign Tasks</h3>
              <p className="text-gray-600">
                Break down work into manageable tasks, assign responsibilities, and set deadlines.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-[#F7630C] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Track & Deliver</h3>
              <p className="text-gray-600">
                Monitor progress, identify bottlenecks, and ensure on-time delivery with real-time updates.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 max-w-4xl mx-auto">
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="Oracle Cloud Tasks Workflow"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#3A3A3A]">What Our Customers Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from teams that have transformed their project management with Oracle Cloud Tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-[#F7630C]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Oracle Cloud Tasks has completely transformed how our team manages projects. The intuitive interface
                and powerful features have increased our productivity by 30%."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300 mr-3">
                  <img src="/placeholder.svg?height=48&width=48" alt="User" className="rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-[#3A3A3A]">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Project Manager, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-[#F7630C]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The sprint management features are exceptional. We've been able to deliver projects on time
                consistently since implementing Oracle Cloud Tasks."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300 mr-3">
                  <img src="/placeholder.svg?height=48&width=48" alt="User" className="rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-[#3A3A3A]">Michael Chen</p>
                  <p className="text-sm text-gray-500">Development Lead, InnovateSoft</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="text-[#F7630C]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The analytics and reporting capabilities have given us unprecedented visibility into our project
                performance. It's been a game-changer for our executive team."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300 mr-3">
                  <img src="/placeholder.svg?height=48&width=48" alt="User" className="rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-[#3A3A3A]">Emily Rodriguez</p>
                  <p className="text-sm text-gray-500">CTO, CloudSolutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#3A3A3A]">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your team. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Starter</h3>
              <p className="text-gray-600 mb-4">Perfect for small teams getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#3A3A3A]">$9</span>
                <span className="text-gray-500">/user/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Up to 10 team members</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-[#3A3A3A]">Start Free Trial</Button>
            </div>

            <div className="bg-white p-8 rounded-lg border-2 border-[#F7630C] shadow-lg transform scale-105">
              <div className="inline-block px-3 py-1 bg-orange-100 text-[#F7630C] rounded-full text-xs font-medium mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Professional</h3>
              <p className="text-gray-600 mb-4">Ideal for growing teams and organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#3A3A3A]">$19</span>
                <span className="text-gray-500">/user/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced sprint planning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Custom workflows</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-[#F7630C] hover:bg-[#E25A00]">Start Free Trial</Button>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">For large organizations with complex needs</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#3A3A3A]">$39</span>
                <span className="text-gray-500">/user/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>SSO & advanced security</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>24/7 premium support</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-[#3A3A3A]">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#3A3A3A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your project management?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of teams that use Oracle Cloud Tasks to deliver projects on time and within budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" passHref>
              <Button size="lg" className="bg-[#F7630C] hover:bg-[#E25A00]">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-md bg-[#F7630C] flex items-center justify-center text-white font-bold">
                  O
                </div>
                <div className="font-semibold text-[#3A3A3A]">Oracle Cloud Tasks</div>
              </div>
              <p className="text-gray-600">
                A powerful project management tool designed for teams to track tasks, manage sprints, and deliver
                projects on time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#3A3A3A]">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-[#F7630C]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-[#F7630C]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#3A3A3A]">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#3A3A3A]">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#F7630C]">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} Oracle Cloud Tasks. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#F7630C]">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F7630C]">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F7630C]">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F7630C]">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

