import { assets } from '../assets/assets';

const Header = () => {
  return (
    <div className='relative w-full h-[80vh] md:h-[80vh] overflow-hidden'>
      <video 
        className='absolute inset-0 w-full h-full object-cover'
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={assets.banner} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className='absolute inset-0 bg-black bg-opacity-20 flex items-end justify-left pb-40 pl-10 md:pl-20'>
        <div className='text-left text-brown max-w-2xl'>
          <p className='text-2xl md:text-3xl lg:text-5xl font-bold leading-tight mb-6'>
            Reconnect with your smile
          </p>
          <div className='flex flex-col md:flex-row items-left gap-3 text-xl text-base font-light mb-8'>
            <p>
              Book a complimentary consultation today.
            </p>
          </div>
          <a 
            href="#speciality" 
            className='inline-flex items-center gap-2 bg-white px-8 py-3 rounded-full text-book text-sm hover:scale-105 transition-all duration-300'
          >
            Book appointment <img className='w-3' src={assets.arrow_icon} alt="Arrow Icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;