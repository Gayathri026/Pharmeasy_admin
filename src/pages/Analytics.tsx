import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const Analytics = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        
        <div className="flex flex-1 flex-col">
          <AdminHeader />
          
          <main className="flex-1 space-y-6 p-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
              <p className="text-muted-foreground">
                View detailed insights and performance metrics
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  Comprehensive analytics and reporting features coming soon
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Charts and analytics will be displayed here</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
