import { useQuery } from "@tanstack/react-query";
import { Globe, PiggyBank, Clock, Building } from "lucide-react";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/portfolio/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 animate-pulse">
            <div className="h-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">Total Domains</p>
            <p className="text-2xl font-bold text-blue-900">{(stats as any)?.totalDomains || 0}</p>
          </div>
          <Globe className="text-blue-600 text-xl" />
        </div>
      </div>

      <div className="savings-positive p-4 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">Annual Savings</p>
            <p className="text-2xl font-bold text-green-900">
              ${((stats as any)?.totalSavings || 0).toFixed(2)}
            </p>
          </div>
          <PiggyBank className="text-green-600 text-xl" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-800">Expiring Soon</p>
            <p className="text-2xl font-bold text-orange-900">{(stats as any)?.expiringSoon || 0}</p>
          </div>
          <Clock className="text-orange-600 text-xl" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-800">Registrars</p>
            <p className="text-2xl font-bold text-purple-900">{(stats as any)?.registrarCount || 0}</p>
          </div>
          <Building className="text-purple-600 text-xl" />
        </div>
      </div>
    </div>
  );
}
