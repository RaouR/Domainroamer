import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Globe, ArrowUpDown, ExternalLink, Edit, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { DomainWithComparison } from "@shared/schema";

export default function DomainTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: domains, isLoading } = useQuery({
    queryKey: ["/api/domains"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (domainId: string) => {
      await apiRequest("DELETE", `/api/domains/${domainId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/stats"] });
      toast({
        title: "Success",
        description: "Domain deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete domain",
        variant: "destructive",
      });
    },
  });

  const filteredDomains = (domains as DomainWithComparison[] || [])?.filter((domain: DomainWithComparison) =>
    domain.domainName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-textPrimary mb-2 sm:mb-0">
            Domain Portfolio & Savings Opportunities
          </h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                  Domain <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                  Current Registrar <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                  Current Price <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                  Best Price <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
                  Annual Savings <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDomains.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No domains found</h3>
                    <p className="text-gray-500">Upload a CSV file or add domains manually to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDomains.map((domain: DomainWithComparison) => (
                <tr key={domain.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Globe className="text-gray-400 mr-3 h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium text-textPrimary">{domain.domainName}</div>
                        <div className="text-sm text-textSecondary">{domain.tld} domain</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {domain.registrar}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary font-mono">
                    ${parseFloat(domain.renewalPrice || '0').toFixed(2)}/year
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-success font-mono">
                        {domain.bestPrice}/year
                      </span>
                      {domain.bestRegistrar && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                          {domain.bestRegistrar}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {domain.savingsAmount && domain.savingsAmount > 0 ? (
                      <Badge className="bg-green-100 text-green-800">
                        ↓ {domain.savings}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        ✓ Optimal
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                    {new Date(domain.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {domain.savingsAmount && domain.savingsAmount > 0 ? (
                        <Button size="sm" variant="ghost" title="Transfer Domain">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled title="Already Optimal">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" title="Edit Domain">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        title="Remove Domain"
                        onClick={() => deleteMutation.mutate(domain.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredDomains.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-textSecondary">
              Showing <span className="font-medium text-textPrimary">{filteredDomains.length}</span> domain{filteredDomains.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
