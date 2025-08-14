import { useQuery } from "@tanstack/react-query";
import { Download, Clock, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DomainWithComparison } from "@shared/schema";

export default function SavingsSummary() {
  const { data: domains } = useQuery({
    queryKey: ["/api/domains"],
  });

  const domainsWithSavings = (domains as DomainWithComparison[])?.filter(
    domain => domain.savingsAmount && domain.savingsAmount > 0
  ) || [];

  const totalSavings = domainsWithSavings.reduce(
    (sum, domain) => sum + (domain.savingsAmount || 0), 0
  );

  const expiringSoon = (domains as DomainWithComparison[])?.filter(domain => {
    const expiryDate = new Date(domain.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  }).length || 0;

  return (
    <div className="mt-8">
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-textPrimary">Savings Summary & Recommendations</h3>
          <Button className="bg-success hover:bg-green-600 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download Transfer Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-md font-medium text-textPrimary mb-4">Potential Annual Savings</h4>
            <div className="space-y-3">
              {domainsWithSavings.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">No savings opportunities found.</p>
                  <p className="text-sm text-gray-400 mt-1">Your domains are already optimally priced!</p>
                </div>
              ) : (
                <>
                  {domainsWithSavings.slice(0, 3).map((domain) => (
                    <div key={domain.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-800">
                        Transfer {domain.domainName} to {domain.bestRegistrar}
                      </span>
                      <span className="font-semibold text-green-900">{domain.savings}/year</span>
                    </div>
                  ))}
                  {domainsWithSavings.length > 3 && (
                    <div className="text-sm text-gray-500 text-center">
                      +{domainsWithSavings.length - 3} more opportunities
                    </div>
                  )}
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-textPrimary">Total Annual Savings:</span>
                      <span className="text-success">${totalSavings.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-textPrimary mb-4">Recommended Actions</h4>
            <div className="space-y-3">
              {expiringSoon > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <Clock className="text-yellow-600 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">{expiringSoon} domains expire soon</p>
                    <p className="text-xs text-yellow-700">Consider transferring before renewal</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <RefreshCw className="text-blue-600 mr-3 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Pricing data updated recently</p>
                  <p className="text-xs text-blue-700">Refresh for latest rates</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Shield className="text-purple-600 mr-3 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Enable WHOIS privacy</p>
                  <p className="text-xs text-purple-700">Some registrars offer free privacy protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
