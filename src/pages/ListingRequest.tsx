import DashboardLayout from "../layout/DashboardLayout";
import ListingRequestsTable from "../components/ListingRequestsTable";

const ListingRequest = () => {
  return (
    <DashboardLayout>
      {/* LISTING REQUESTS TABLE */}
      <div className="mx-3 mb-8">
        <ListingRequestsTable />
      </div>
    </DashboardLayout>
  );
};

export default ListingRequest;
