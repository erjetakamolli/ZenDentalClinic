import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
        <br />
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.locaton}
          alt=""
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-primary">OUR OFFICE</p>
          <p className="text-gray-500">
            Myslym Shyri Street <br /> Tirana, Albania
          </p>
          <p className="text-gray-500">
            Tel: +355 69 12 3 56780 <br /> Email: zendental@gmail.com
          </p>
          <p className="font-semibold text-lg text-primary">
            CAREERS AT ZEN DENTAL
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;

