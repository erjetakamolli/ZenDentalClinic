import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Services = () => {
  const navigate = useNavigate();
  const { services } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium text-primary">General Dentistry Services</h1>
      <p className="text-gray-600 text-center">
        Browse through our list of dental services.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {services.map((item, index) => (
          <div
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img
              className="bg-blue-50 w-full h-48 object-cover"
              src={item.image}
              alt={item.name}
            />
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm text-center ${
                  item.available ? "text-green-500" : "text-gray-500"
                }`}
              >
                <p
                  className={`w-2 h-2 ${
                    item.available ? "bg-green-500" : "bg-gray-500"
                  } rounded-full`}
                ></p>
                <p>{item.available ? "Available" : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm ">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;