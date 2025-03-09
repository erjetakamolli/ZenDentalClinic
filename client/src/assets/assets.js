import ZenLogo from './ZenLogo.png'
import banner from './banner.mp4'
import arrow_icon from './arrow_icon.svg'
import appointment_img from './appointment_img.png'
import dentalstudio from './dentalstudio.jpg'
import locaton from './locaton.jpg'
import dentist1 from './dentist1.png'
import dentist2 from './dentist2.png'
import teethcleaning from './teethcleaning.jpg'
import teethwhiting from './teethwhiting.jpg'
import rootcanal from './rootcanal.jpg'
import dentalcrowns from './dentalcrowns.jpg'
import dentalimplants from './dentalimplants.jpg'
import braces from './braces.jpg'
import toothextraxtion from './toothextraxtion.jpg'
import gumtreatment from './gymtreatment.jpg'
import upload_area from './upload_area.png'
import upload_icon from './upload_icon.png'

export const assets = {
    ZenLogo,
    banner,
    arrow_icon,
    appointment_img,
    dentalstudio,
    locaton,
    upload_area,
    upload_icon
}

export const MenuData = [
    {
        name: 'Srijana Pokhrel, Dentist',
        image: dentist1
    },
    {
        name: 'Aida Zhupani, Dentist',
        image: dentist2
    },
]

export const dentalServices = [
    {
        _id: 'service1',
        name: 'Teeth Cleaning',
        image: teethcleaning,
        description: 'Professional teeth cleaning to remove plaque and tartar, ensuring optimal oral health.',
        duration: '30 minutes',
        price: 50,
        available: true,
    },
    {
        _id: 'service2',
        name: 'Teeth Whitening',
        image: teethwhiting,
        description: 'Advanced teeth whitening treatments to brighten your smile.',
        duration: '1 hour',
        price: 100,
        available: true, 
    },
    {
        _id: 'service3',
        name: 'Root Canal Therapy',
        image: rootcanal,
        description: 'Effective treatment for infected or damaged tooth pulp.',
        duration: '1.5 hours',
        price: 200,
        available: true, 
    },
    {
        _id: 'service4',
        name: 'Dental Crowns',
        image: dentalcrowns,
        description: 'Custom-made crowns to restore damaged or decayed teeth.',
        duration: '2 hours',
        price: 300,
        available: true, 
    },
    {
        _id: 'service5',
        name: 'Dental Implants',
        image: dentalimplants,
        description: 'Permanent solution for missing teeth with natural-looking implants.',
        duration: '2 hours',
        price: 500,
        available: true, 
    },
    {
        _id: 'service6',
        name: 'Orthodontics (Braces)',
        image: braces,
        description: 'Correct misaligned teeth and improve your bite with braces.',
        duration: '1.5 hours',
        price: 250,
        available: true,
    },
    {
        _id: 'service7',
        name: 'Tooth Extraction',
        image: toothextraxtion,
        description: 'Safe and painless removal of damaged or problematic teeth.',
        duration: '1 hour',
        price: 75,
        available: true, 
    },
    {
        _id: 'service8',
        name: 'Gum Disease Treatment',
        image: gumtreatment,
        description: 'Comprehensive treatment for gingivitis and periodontitis.',
        duration: '1 hour',
        price: 120,
        available: true, 
    },
];
