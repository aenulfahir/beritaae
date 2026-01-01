import { getAdminAnalyticsData } from "@/lib/supabase/services/admin-data";
import { AnalyticsClient } from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const {
    metrics,
    weeklyViews,
    trafficSources,
    topPages,
    categoryPerformance,
    hourlyTraffic,
    realtimeStats,
    deviceData,
  } = await getAdminAnalyticsData();

  return (
    <AnalyticsClient
      initialMetrics={metrics}
      initialWeeklyViews={weeklyViews}
      initialTrafficSources={trafficSources}
      initialTopPages={topPages}
      initialCategoryPerformance={categoryPerformance}
      initialHourlyTraffic={hourlyTraffic}
      initialRealtimeStats={realtimeStats}
      initialDeviceData={deviceData}
    />
  );
}
