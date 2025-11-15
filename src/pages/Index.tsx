// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AdminSidebar } from "@/components/AdminSidebar";
// import { AdminHeader } from "@/components/AdminHeader";
// import { DashboardStats } from "@/components/DashboardStats";
// import { OrdersTable } from "@/components/OrdersTable";
// import { PrescriptionVerification } from "@/components/PrescriptionVerification";
// import { RecentActivity } from "@/components/RecentActivity";

// const Index = () => {
//   const recentOrders = [
//     {
//       id: "ORD-001",
//       customer: "Rajesh Kumar",
//       items: "Paracetamol 650mg, Vitamin C",
//       amount: "₹385",
//       status: "Pending Verification",
//       date: "2025-01-15",
//     },
//     {
//       id: "ORD-002",
//       customer: "Priya Sharma",
//       items: "Amoxicillin 500mg",
//       amount: "₹520",
//       status: "Verified",
//       date: "2025-01-15",
//     },
//     {
//       id: "ORD-003",
//       customer: "Amit Patel",
//       items: "Blood Pressure Monitor",
//       amount: "₹1,250",
//       status: "Assigned to Seller",
//       date: "2025-01-14",
//     },
//   ];

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-background">
//         <AdminSidebar />

//         <div className="flex flex-1 flex-col">
//           <AdminHeader />

//           <main className="flex-1 space-y-6 p-6">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
//               <p className="text-muted-foreground">
//                 Welcome back! Here's what's happening with your pharmacy platform.
//               </p>
//             </div>

//             <DashboardStats />

//             <div className="grid gap-6 lg:grid-cols-3">
//               <div className="lg:col-span-2">
//                 <PrescriptionVerification />
//               </div>
//               <div>
//                 <RecentActivity />
//               </div>
//             </div>

//             <div>
//               <div className="mb-4 flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
//                 <a href="/orders" className="text-sm text-primary hover:underline">
//                   View all
//                 </a>
//               </div>
//               <OrdersTable orders={recentOrders} onViewOrder={() => {}} />
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Index;


// src/pages/Index.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { OrdersTable } from "@/components/OrdersTable";
import { PrescriptionVerification } from "@/components/PrescriptionVerification";
import { RecentActivity } from "@/components/RecentActivity";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = () => {
  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Rajesh Kumar",
      items: "Paracetamol 650mg, Vitamin C",
      amount: "₹385",
      status: "Pending Verification",
      date: "2025-01-15",
    },
    {
      id: "ORD-002",
      customer: "Priya Sharma",
      items: "Amoxicillin 500mg",
      amount: "₹520",
      status: "Verified",
      date: "2025-01-15",
    },
    {
      id: "ORD-003",
      customer: "Amit Patel",
      items: "Blood Pressure Monitor",
      amount: "₹1,250",
      status: "Assigned to Seller",
      date: "2025-01-14",
    },
  ];

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AdminSidebar />

          <div className="flex flex-1 flex-col">
            <AdminHeader />

            <main className="flex-1 space-y-6 p-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your pharmacy platform.
                </p>
              </div>

              <DashboardStats />

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <PrescriptionVerification />
                </div>
                <div>
                  <RecentActivity />
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
                  <a href="/orders" className="text-sm text-primary hover:underline">
                    View all
                  </a>
                </div>
                <OrdersTable orders={recentOrders} onViewOrder={() => { }} />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Index;