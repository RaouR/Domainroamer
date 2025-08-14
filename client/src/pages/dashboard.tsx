import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Globe, Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCards from "@/components/stats-cards";
import DomainTable from "@/components/domain-table";
import CsvUpload from "@/components/csv-upload";
import AddDomainForm from "@/components/add-domain-form";
import SavingsSummary from "@/components/savings-summary";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading, logoutMutation } = useAuth();

  // Since this page is protected by ProtectedRoute, we don't need manual auth checking

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = (user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'User';

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Globe className="text-primary text-2xl mr-3" />
                <h1 className="text-xl font-bold text-textPrimary">Registrar Optimizer</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#dashboard" className="text-primary font-medium border-b-2 border-primary pb-4">Dashboard</a>
                <a href="#compare" className="text-textSecondary hover:text-textPrimary pb-4">Price Compare</a>
                <a href="#import" className="text-textSecondary hover:text-textPrimary pb-4">Import Domains</a>
                <a href="#savings" className="text-textSecondary hover:text-textPrimary pb-4">Savings Report</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="default" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <div className="flex items-center space-x-2">
                {(user as any)?.profileImageUrl ? (
                  <img 
                    src={(user as any).profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <button 
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-sm text-textSecondary hover:text-textPrimary"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-surface rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-textPrimary mb-2">
                  Welcome back, {displayName}!
                </h2>
                <p className="text-textSecondary">Here's your domain portfolio optimization summary</p>
              </div>
            </div>

            {/* Stats Cards */}
            <StatsCards />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-surface rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-textPrimary">Quick Actions</h3>
              <AddDomainForm />
            </div>
            <CsvUpload />
          </div>
        </div>

        {/* Domain Portfolio Table */}
        <DomainTable />

        {/* Savings Summary */}
        <SavingsSummary />
      </div>
    </div>
  );
}
