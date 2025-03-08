import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-40" src={assets.ZenLogo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
           Our dental clinic is one of the few dental clinics in Albania with 24/7 service. Our staff is always ready to assist you with professionalism at any time of the day, supported by modern technological equipment.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+355 69 12 3 56780</li>
            <li>zendental@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright &#169; 2025 ZenDental - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;

