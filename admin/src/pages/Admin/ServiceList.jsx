import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";

const ServiceList = () => {
  const {aToken } = useContext(AdminContext);
  const [services, setServices] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const getAllServices = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/services", {
        headers: { aToken },
      });

      if (data.services) {
        setServices(data.services);
      } else {
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  console.log('services', services)

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Services</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {services && services.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={index}
          >
            <img
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">{item.description}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                
                {
                  item.available ?  <p>Available</p> :  <p>Not available</p>
                }
               
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
