import React, { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const dummyAppointments = [
  {
    _id: "1",
    userData: {
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      dob: "1990-05-15",
    },
    slotDate: "2025-03-12",
    slotTime: "10:00 AM",
    amount: 100,
    cancelled: false,
    isCompleted: false,
  },
  {
    _id: "2",
    userData: {
      name: "Jane Doe",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      dob: "1985-08-25",
    },
    slotDate: "2025-03-14",
    slotTime: "2:00 PM",
    amount: 120,
    cancelled: false,
    isCompleted: true,
  },
  {
    _id: "3",
    userData: {
      name: "Michael Brown",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      dob: "2000-11-10",
    },
    slotDate: "2025-03-15",
    slotTime: "4:30 PM",
    amount: 90,
    cancelled: true,
    isCompleted: false,
  },
];

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {dummyAppointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt="User"
              />{" "}
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <img
                onClick={() => cancelAppointment(item._id)}
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt="Cancel"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;  
