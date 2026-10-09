import DashboardLayout from '../layout/DashboardLayout'
import AddPropertyForm from '../components/AddPropertyForm';

const AddProperty = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center gap-4">
        {" "}
        <h5 className="text-[#6E6D6D]">My Properties</h5>{" "}
        <img src="/images/arrow-right.png" alt="" /> <h5>Add New Property</h5>
      </div>

      <div className="mt-[33px]">
        <h3 className="text-[#1D1D1D] text-[20px] ">Add a New Property</h3>
        <p className="text-[16px] text-[#606060]">
          Provide details about your property so buyer can easily discover it.
        </p>
      </div>
{/* 
      <form
        className="mt-[39px] max-w-[804px] mx-auto rounded-md border border-[#E6E3E3] p-4 bg-white"
        action="
"
      >
        <div className="px-6 mb-6">
          <h4 className="mb-4">Basic Information</h4>
          <div>
            <DragDropUpload />
          </div>

          <div className="mt-[23px]">
            <h4 className="text-[16px] text-[#0C0C0C]">Property Title</h4>
            <input
              type="text"
              className="w-full focus:outline-none border border-[#E6E3E3] rounded-md px-3 py-2"
              placeholder="Enter property title"
            />
          </div>

          <div></div>
        </div>

        <div>
            <h4>Location</h4>
        </div>
      </form> */}

      <AddPropertyForm/>
    </DashboardLayout>
  );
}

export default AddProperty