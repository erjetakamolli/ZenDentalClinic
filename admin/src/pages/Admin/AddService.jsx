import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddService = () => {
  const [serviceImg, setServiceImg] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!serviceImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();
      formData.append("image", serviceImg);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("available", available);

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-service`,
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setServiceImg(null);
        setName("");
        setDescription("");
        setAvailable(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Service</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="service-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={serviceImg ? URL.createObjectURL(serviceImg) : assets.upload_area}
              alt="Upload"
            />
          </label>
          <input
            onChange={(e) => setServiceImg(e.target.files[0])}
            type="file"
            id="service-img"
            hidden
          />
          <p>Upload service image</p>
        </div>

        <div className="flex flex-col gap-4 text-gray-600">
          <div className="flex flex-col gap-1">
            <p>Service Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border rounded px-3 py-2"
              type="text"
              placeholder="Service Name"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p>Description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-4 pt-2 border rounded"
              placeholder="Write about the service"
              rows={5}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <p>Available</p>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Service
        </button>
      </div>
    </form>
  );
};

export default AddService;
