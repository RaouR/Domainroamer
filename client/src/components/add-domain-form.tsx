import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddDomainForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    domainName: "",
    tld: "",
    registrar: "",
    expiryDate: "",
    renewalPrice: "",
  });
  const { toast } = useToast();

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/domains", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/stats"] });
      setFormData({
        domainName: "",
        tld: "",
        registrar: "",
        expiryDate: "",
        renewalPrice: "",
      });
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Domain added successfully",
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
        description: "Failed to add domain",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domainName || !formData.tld || !formData.registrar || !formData.expiryDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    addMutation.mutate(formData);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Domain
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Add New Domain</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Domain name"
              value={formData.domainName}
              onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
              required
            />
            <Input
              placeholder="TLD (e.g. .com, .co, .site)"
              value={formData.tld}
              onChange={(e) => setFormData({ ...formData, tld: e.target.value })}
              required
            />
          </div>
          
          <Select onValueChange={(value) => setFormData({ ...formData, registrar: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Current Registrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cloudflare">Cloudflare</SelectItem>
              <SelectItem value="Namecheap">Namecheap</SelectItem>
              <SelectItem value="GoDaddy">GoDaddy</SelectItem>
              <SelectItem value="Porkbun">Porkbun</SelectItem>
              <SelectItem value="Squarespace">Squarespace</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              placeholder="Expiry Date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              required
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Renewal Price"
              value={formData.renewalPrice}
              onChange={(e) => setFormData({ ...formData, renewalPrice: e.target.value })}
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={addMutation.isPending}
              className="flex-1 bg-primary hover:bg-blue-700"
            >
              {addMutation.isPending ? "Adding..." : "Add Domain"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}