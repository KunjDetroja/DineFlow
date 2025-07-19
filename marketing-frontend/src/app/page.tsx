import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
        {/* Hero Section with Tailwind Classes */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to Marketing Frontend
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A modern marketing website built with Next.js, Tailwind CSS, and shadcn/ui components.
            Demonstrating responsive design and component integration.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Tailwind CSS Integration
              </CardTitle>
              <CardDescription>
                Utility-first CSS framework with responsive design classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <p className="text-sm text-muted-foreground">
                  Responsive grid, gradients, and hover effects working perfectly
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                shadcn/ui Components
              </CardTitle>
              <CardDescription>
                Pre-built, accessible UI components with consistent styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Test input component" type="text" />
              <div className="flex gap-2 flex-wrap">
                <Button size="sm">Small</Button>
                <Button variant="outline" size="sm">Outline</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo Section */}
        <Card className="w-full max-w-md border-2 border-dashed border-primary/20">
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Test the integration with interactive components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter your email" type="email" />
            <div className="flex gap-2">
              <Button className="flex-1">Get Started</Button>
              <Button variant="outline" className="flex-1">Learn More</Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicator */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              All systems operational
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Next.js • Tailwind CSS • shadcn/ui • TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}
