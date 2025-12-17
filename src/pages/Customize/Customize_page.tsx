// import { useEffect, useState } from 'react';
// import { ThemeDefinition, ThemeOption, themes, useTheme } from '../../theme';

// const themeCards: ThemeDefinition[] = Object.values(themes);

// export default function Customize_page() {
//   const { theme: appliedThemeData, themeName: appliedTheme, setTheme } = useTheme();
//   const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(appliedTheme);

//   useEffect(() => {
//     setSelectedTheme(appliedTheme);
//   }, [appliedTheme]);

//   return (
//     <div
//       className="flex min-h-full w-full items-center justify-center px-4 py-10"
//       style={{ backgroundColor: appliedThemeData.background }}
//     >
//       <div
//         className="w-full max-w-4xl rounded-3xl border p-8 shadow-2xl"
//         style={{ backgroundColor: appliedThemeData.surface, borderColor: appliedThemeData.border }}
//       >
//         <header
//           className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
//           style={{ color: appliedThemeData.primaryText }}
//         >
//           <div>
//             <p
//               className="text-xs font-semibold uppercase tracking-wide"
//               style={{ color: appliedThemeData.secondaryText }}
//             >
//               Appearance
//             </p>
//             <h1 className="text-2xl font-bold" style={{ color: appliedThemeData.primaryText }}>
//               Choose Theme
//             </h1>
//             <p className="text-sm" style={{ color: appliedThemeData.secondaryText }}>
//               Switch between light and dark presets.
//             </p>
//           </div>

//         </header>

//         <section className="mt-8 grid gap-6 md:grid-cols-2">
//           {themeCards.map((theme) => {
//             const isSelected = theme.id === selectedTheme;
//             return (
//               <button
//                 key={theme.id}
//                 type="button"
//                 onClick={() => setSelectedTheme(theme.id)}
//                 className={`rounded-2xl border p-6 text-left transition hover:shadow-lg ${isSelected ? 'ring-2' : ''
//                   }`}
//                 style={{
//                   borderColor: isSelected ? appliedThemeData.accent : appliedThemeData.border,
//                   boxShadow: isSelected ? `0 0 0 4px ${appliedThemeData.accent}1a` : undefined,
//                   backgroundColor: appliedThemeData.surface,
//                   color: appliedThemeData.primaryText,
//                 }}
//               >
//                 <div
//                   className="flex h-32 w-full items-center justify-center rounded-2xl"
//                   style={{ backgroundColor: theme.background, color: theme.primaryText }}
//                 >
//                   <span className="text-sm font-semibold uppercase tracking-wide">
//                     {theme.label}
//                   </span>
//                 </div>
//                 <p className="mt-4 text-sm" style={{ color: appliedThemeData.secondaryText }}>
//                   {theme.id === 'light' ? 'Soft neutrals and bright surfaces.' : 'Deep tones with high contrast.'}
//                 </p>
//               </button>
//             );
//           })}
//         </section>

//         <footer
//           className="mt-8 flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between"
//           style={{ color: appliedThemeData.secondaryText }}
//         >
//           <span>
//             Applied theme:{' '}
//             <strong style={{ color: appliedThemeData.primaryText }}>{appliedTheme}</strong>
//           </span>
//           <div className="flex gap-3">
//             <button
//               type="button"
//               className="rounded-2xl border px-4 py-2 font-semibold"
//               style={{ borderColor: appliedThemeData.border, color: appliedThemeData.primaryText }}
//               onClick={() => setSelectedTheme(appliedTheme)}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className="rounded-2xl px-4 py-2 font-semibold text-white"
//               style={{ backgroundColor: appliedThemeData.accent }}
//               onClick={() => setTheme(selectedTheme)}
//             >
//               Apply Changes
//             </button>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }



// AccountSettings.tsx
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Camera, 
//   Trash2,
//   Save,
//   Shield,
//   Bell
// } from 'lucide-react';

// // Validation schema
// const schema = yup.object({
//   firstName: yup.string().required('First name is required'),
//   lastName: yup.string().required('Last name is required'),
//   email: yup.string().email('Invalid email').required('Email is required'),
//   mobileNumber: yup.string().required('Mobile number is required'),
//   gender: yup.string().required('Gender is required'),
//   idNumber: yup.string().required('ID number is required'),
//   taxIdentificationNumber: yup.string().required('Tax ID is required'),
//   taxIdentificationCountry: yup.string().required('Country is required'),
//   residentialAddress: yup.string().required('Address is required'),
// });

// type FormData = yup.InferType<typeof schema>;

// interface ProfileSettingsProps {
//   activeTab: string;
// }

// const ProfileSettings: React.FC<ProfileSettingsProps> = ({ activeTab }) => {
//   const [avatar, setAvatar] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       firstName: 'First name',
//       lastName: 'Last name',
//       email: 'examples@gmail.com',
//       mobileNumber: '0806 123 7890',
//       gender: 'male',
//       idNumber: '1559 000 7788 8DER',
//       taxIdentificationNumber: 'examples@gmail.com',
//       taxIdentificationCountry: 'Nigeria',
//       residentialAddress: 'lb street orogun ibadan',
//     },
//   });

//   const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatar(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDeleteAvatar = () => {
//     setAvatar(null);
//   };

//   const onSubmit = async (data: FormData) => {
//     setIsSaving(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     console.log('Form data:', data);
//     setIsSaving(false);
//     // Show success message
//     alert('Profile updated successfully!');
//   };

//   if (activeTab !== 'profile') return null;

//   return (
//     <div className=" h-full max-w-8xl mx-auto p-6">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Account settings</h1>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* Profile Picture Section */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//             <div className="relative">
//               <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
//                 {avatar ? (
//                   <img 
//                     src={avatar} 
//                     alt="Profile" 
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <User size={48} className="text-gray-400" />
//                 )}
//               </div>
//               <input
//                 type="file"
//                 id="avatar-upload"
//                 accept="image/*"
//                 onChange={handleAvatarUpload}
//                 className="hidden"
//               />
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload New / Delete avatar</h3>
//               <div className="flex flex-wrap gap-3">
//                 <label
//                   htmlFor="avatar-upload"
//                   className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors flex items-center gap-2"
//                 >
//                   <Camera size={18} />
//                   Upload New
//                 </label>
//                 <button
//                   type="button"
//                   onClick={handleDeleteAvatar}
//                   className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
//                 >
//                   <Trash2 size={18} />
//                   Delete avatar
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Personal Information */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* First Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name *
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <User size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   {...register('firstName')}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                     errors.firstName ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                 />
//               </div>
//               {errors.firstName && (
//                 <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
//               )}
//             </div>

//             {/* Last Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name *
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <User size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   {...register('lastName')}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                     errors.lastName ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                 />
//               </div>
//               {errors.lastName && (
//                 <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email *
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <Mail size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   {...register('email')}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                     errors.email ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Mobile Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mobile Number *
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <Phone size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="tel"
//                   {...register('mobileNumber')}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                     errors.mobileNumber ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                 />
//               </div>
//               {errors.mobileNumber && (
//                 <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
//               )}
//             </div>

//             {/* Gender */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Gender *
//               </label>
//               <div className="flex gap-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="male"
//                     {...register('gender')}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="ml-2 text-gray-700">Male</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="female"
//                     {...register('gender')}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="ml-2 text-gray-700">Female</span>
//                 </label>
//               </div>
//               {errors.gender && (
//                 <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//               )}
//             </div>

//             {/* ID */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ID *
//               </label>
//               <input
//                 type="text"
//                 {...register('idNumber')}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                   errors.idNumber ? 'border-red-300' : 'border-gray-300'
//                 }`}
//               />
//               {errors.idNumber && (
//                 <p className="mt-1 text-sm text-red-600">{errors.idNumber.message}</p>
//               )}
//             </div>

//             {/* Tax Information */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Tax Identification Number *
//               </label>
//               <input
//                 type="text"
//                 {...register('taxIdentificationNumber')}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                   errors.taxIdentificationNumber ? 'border-red-300' : 'border-gray-300'
//                 }`}
//               />
//               {errors.taxIdentificationNumber && (
//                 <p className="mt-1 text-sm text-red-600">{errors.taxIdentificationNumber.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Tax Identification Country *
//               </label>
//               <input
//                 type="text"
//                 {...register('taxIdentificationCountry')}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                   errors.taxIdentificationCountry ? 'border-red-300' : 'border-gray-300'
//                 }`}
//               />
//               {errors.taxIdentificationCountry && (
//                 <p className="mt-1 text-sm text-red-600">{errors.taxIdentificationCountry.message}</p>
//               )}
//             </div>

//             {/* Residential Address */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Residential Address *
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-3">
//                   <MapPin size={18} className="text-gray-400" />
//                 </div>
//                 <textarea
//                   {...register('residentialAddress')}
//                   rows={3}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
//                     errors.residentialAddress ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                 />
//               </div>
//               {errors.residentialAddress && (
//                 <p className="mt-1 text-sm text-red-600">{errors.residentialAddress.message}</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={isSaving}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
//           >
//             <Save size={18} />
//             {isSaving ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProfileSettings;
