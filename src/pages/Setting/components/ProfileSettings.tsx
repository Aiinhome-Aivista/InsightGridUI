import React, { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Trash2,
  Save,
} from 'lucide-react';
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: yup.string().required('Mobile number is required'),
  gender: yup.string().required('Gender is required'),
  idNumber: yup.string().required('ID number is required'),
  taxIdentificationNumber: yup.string().required('Tax ID is required'),
  taxIdentificationCountry: yup.string().required('Country is required'),
  residentialAddress: yup.string().required('Address is required'),
  zipCode: yup.string().notRequired(),
});
type FormData = Partial<yup.InferType<typeof schema>>;
interface ProfileSettingsProps {
  activeTab: string;
}
const ProfileSettings: React.FC<ProfileSettingsProps> = ({ activeTab }) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as unknown as Resolver<FormData>,
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
  };

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form data:', data);
    setIsSaving(false);
    alert('Profile updated successfully!');
  };
  if (activeTab !== 'profile') return null;
  return (
    <div className="max-w-8xl">
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="absolute top-6 right-6">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        <div className="rounded-xl px-4 ">
          <div className="flex flex-col md:flex-row items-start md:items-center ">
            <div className="relative p-4 ">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Aiinhome Technologies Pvt. Ltd</h3>
              <div className="flex flex-wrap gap-3">
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors flex items-center gap-2"
                >
                  <Camera size={18} />
                  Upload New
                </label>
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete avatar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl pt-3 px-6">
          <h3 className="text-lg font-semibold text-gray-800 pb-2"> Company Details </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <div className="relative ">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Company name"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Code *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Company Code"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.residentialAddress ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.residentialAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.residentialAddress.message}</p>
              )}
            </div>
   <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Zip Code"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.zipCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.mobileNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
              )}
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ProfileSettings;