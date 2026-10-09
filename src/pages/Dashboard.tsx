import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import PropertyTable from "../components/PropertyTable";
import { AuthContext } from "../context/authContext";
import api from "../api/api";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [properties, setProperties] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [toursRes, propertiesRes] = await Promise.all([
          api.get("/tours"),
          api.get("/properties"),
        ]);
        setTours(toursRes.data);
        setProperties(propertiesRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const totalProperties = properties.length;

  const activeProperties = properties.filter(
    (p) => p.status === "active",
  ).length;

  //  COMPUTED STATS
  const pendingTours = tours.filter((t) => t.status === "pending").length;

  const rescheduledTours = tours.filter(
    (t) => t.status === "rescheduled",
  ).length;

  const propertyActivities = properties.map((property) => ({
    ...property,
    property,
    activity: "Property Added",
    type: "Added",
    status: property.status || "active",
    user: property.user || {
      fullName: property.agentName || property.ownerName || "Property Owner",
    },
  }));

  const combinedActivities = [...propertyActivities, ...tours].sort(
    (a, b) =>
      new Date(b.createdAt ?? b.date ?? 0).getTime() -
      new Date(a.createdAt ?? a.date ?? 0).getTime(),
  );

  if (loading) {
    return (
      <DashboardLayout>
        <Spinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="bg-[#1C1915] m-3 p-6 text-white rounded-xl">
        <h3 className="text-base font-semibold">
          Welcome {user?.fullName || "User"}
        </h3>
        <p className="text-sm">
          Here’s a quick snapshot of your Properties and Tours.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-3 gap-4 mb-[40px]">
        {/* Total Properties  */}
        <div className="w-full p-4 md:p-5 flex justify-between rounded-md border border-[#E6E3E3] bg-white">
          <div>
            <p className="text-sm text-gray-600">Total Properties</p>
            <p className="text-xl font-bold text-gray-900">{totalProperties}</p>
          </div>
          <img src="/images/TotalProp.png" className="w-10 h-10" />
        </div>

        {/* Active Properties */}
        <div className="w-full p-4 md:p-5 flex justify-between rounded-md border border-[#E6E3E3] bg-white">
          <div>
            <p className="text-sm text-gray-600">Active Properties</p>
            <p className="text-xl font-bold text-gray-900">{activeProperties}</p>
          </div>
          <img src="/images/ActiveProp.png" className="w-10 h-10" />
        </div>

        {/* Pending Tours */}
        <div className="w-full p-4 md:p-5 flex justify-between rounded-md border border-[#E6E3E3] bg-white">
          <div>
            <p className="text-sm text-gray-600">Pending Tours</p>
            <p className="text-xl font-bold text-gray-900">{pendingTours}</p>
          </div>
          <img src="/images/PendingTours.png" className="w-10 h-10" />
        </div>

        {/* Rescheduled Tours */}
        <div className="w-full p-4 md:p-5 flex justify-between rounded-md border border-[#E6E3E3] bg-white">
          <div>
            <p className="text-sm text-gray-600">Rescheduled Tours</p>
            <p className="text-xl font-bold text-gray-900">{rescheduledTours}</p>
          </div>
          <img src="/images/RescheduledTours.png" className="w-10 h-10" />
        </div>
      </div>

      {/* TABLE */}
      <div className="mx-3 mb-8">
        <PropertyTable activities={combinedActivities} />
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
