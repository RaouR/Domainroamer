import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { CloudUpload, RefreshCw, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CsvUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('csv', file);
      
      const response = await fetch('/api/domains/import', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/stats"] });
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "CSV file imported successfully",
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
        description: "Failed to import CSV file",
        variant: "destructive",
      });
    },
  });

  const initializePricingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/initialize-pricing', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize pricing');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      toast({
        title: "Success",
        description: "Pricing data initialized successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initialize pricing data",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border-2 border-dashed border-gray-300 hover:border-primary rounded-lg p-6 text-center transition-colors cursor-pointer">
        <CloudUpload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
        <h4 className="font-medium text-textPrimary mb-2">Import Domains</h4>
        <p className="text-sm text-textSecondary mb-3">Upload CSV with your domain portfolio</p>
        <div className="space-y-2">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="text-sm"
          />
          {selectedFile && (
            <Button 
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              size="sm"
              className="w-full"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload CSV"}
            </Button>
          )}
        </div>
      </div>

      <div className="border border-gray-200 hover:border-primary rounded-lg p-6 text-center transition-colors cursor-pointer">
        <RefreshCw className="mx-auto h-8 w-8 text-gray-400 mb-3" />
        <h4 className="font-medium text-textPrimary mb-2">Initialize Pricing</h4>
        <p className="text-sm text-textSecondary mb-3">Load sample pricing data from registrars</p>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => initializePricingMutation.mutate()}
          disabled={initializePricingMutation.isPending}
        >
          {initializePricingMutation.isPending ? "Loading..." : "Load Pricing"}
        </Button>
      </div>

      <div className="border border-gray-200 hover:border-primary rounded-lg p-6 text-center transition-colors cursor-pointer">
        <BarChart3 className="mx-auto h-8 w-8 text-gray-400 mb-3" />
        <h4 className="font-medium text-textPrimary mb-2">Generate Report</h4>
        <p className="text-sm text-textSecondary mb-3">Export savings recommendations</p>
        <Button variant="outline" size="sm" className="border-success text-success hover:bg-success hover:text-white">
          Create Report
        </Button>
      </div>
    </div>
  );
}
