import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import OverviewTab from "@/components/OverviewTab";
import { UsersTab } from "@/components/UsersTab";
import AlertsTab from "@/components/AlertsTab";
import AnalyticsTab from "@/components/AnalyticsTab";
import { SettingsTab } from "@/components/SettingsTab";
import DataSourcesTab from "@/components/DataSourcesTab";


const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "alerts" && <AlertsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "data" && <DataSourcesTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default Index;
