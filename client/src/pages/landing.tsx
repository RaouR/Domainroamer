import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, DollarSign, Clock, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-slate-900">Registrar Optimizer</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-blue-700"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl md:text-6xl">
            Save Money on
            <span className="text-primary"> Domain Renewals</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Compare domain renewal prices across major registrars and discover potential savings. 
            Import your portfolio and get personalized recommendations.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-blue-700"
            >
              Get Started Free
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto" />
                <CardTitle className="text-lg">Price Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Compare renewal prices across Cloudflare, Namecheap, GoDaddy, Porkbun and more
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Globe className="h-8 w-8 text-blue-600 mx-auto" />
                <CardTitle className="text-lg">Portfolio Import</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Upload your domain list via CSV or connect registrar APIs for automatic import
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto" />
                <CardTitle className="text-lg">Expiry Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Never miss a renewal deadline with automatic expiry date monitoring
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-purple-600 mx-auto" />
                <CardTitle className="text-lg">Transfer Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get detailed transfer recommendations and export actionable savings reports
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ready to Start Saving?</h2>
          <p className="mt-4 text-lg text-slate-600">
            Join domain owners who are already saving hundreds per year on renewals
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="mt-6 bg-primary hover:bg-blue-700"
          >
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
}
