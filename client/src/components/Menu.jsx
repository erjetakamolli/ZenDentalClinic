import { MenuData } from '../assets/assets';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
      <h1 className='text-3xl font-medium text-primary'>Our Providers</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Our staff remains at the forefront of modern dentistry and strives to keep you comfortable and informed, so you can be confident that you’re in expert hands, and view our studio as a sanctuary.
      </p>
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {MenuData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'
            key={index}
            to={`/services/${item.name}`}
          >
            <img
              className='w-16 sm:w-24 mb-2 rounded-full object-cover'
              src={item.image}
              alt=""
              style={{ width: '96px', height: '96px' }} 
            />
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;
