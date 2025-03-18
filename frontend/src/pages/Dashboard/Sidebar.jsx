import { FaHome, FaUsers, FaBuilding, FaMoneyBillWave } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">Society Dashboard</h2>
      <ul>
        <li className="mb-4 flex items-center gap-3 cursor-pointer hover:text-gray-300">
          <FaHome /> Dashboard
        </li>
        <li className="mb-4 flex items-center gap-3 cursor-pointer hover:text-gray-300">
          <FaUsers /> Residents
        </li>
        <li className="mb-4 flex items-center gap-3 cursor-pointer hover:text-gray-300">
          <FaBuilding /> Facilities
        </li>
        <li className="mb-4 flex items-center gap-3 cursor-pointer hover:text-gray-300">
          <FaMoneyBillWave /> Payments
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;