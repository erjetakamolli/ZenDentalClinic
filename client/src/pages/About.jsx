import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-left text-2xl pt-10 text-primary font-medium">
        <p style={{ marginLeft: '404px' }}>
          ABOUT <span className="text-primary font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.dentalstudio}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to ZEN DENTAL CLINIC! <br />
            Every member of our team is focused on ensuring you receive clear, compassionate, and delightful treatments - and on making sure you feel at home.
          </p>
          <p>
           Receive dental care in our state-of-the-art offices designed by experts to serve as places of comfort and relaxation.
          </p>
          <b className="text-primary">What we’re striving for</b>
          <p>
            At Zen Dental Clinic, nothing is more important than the highest quality of care. Since day one, we have been committed to our values so each of our patients can rest assured they are in good hands.
          </p>
        </div>
      </div>

      <div className="text-xl my-4 text-primary font-semibold">
        <p>
          WHY <span className="text-primary font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Excellence</b>
          <p>
            You deserve exceptional dental care, so we tackle every treatment with our full attention and expertise. 
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Transparency</b>
          <p>
            You deserve full transparency, so we carefully explain each treatment every step of the way.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Mindfulness</b>
          <p>
            Beautiful smiles begin on the inside, which is why our commitment to exceptional dentistry demands we honor your soul as well.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
