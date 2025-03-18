import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">
          Welcome to Society Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl">Total Residents</h3>
            <p className="text-2xl font-bold">120</p>
          </div>
          <div className="bg-green-500 text-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl">Total Facilities</h3>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl">Pending Payments</h3>
            <p className="text-2xl font-bold">$2,340</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
