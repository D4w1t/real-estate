"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from "@/state/api";

const ManagerSettings = () => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const [updateManager] = useUpdateManagerSettingsMutation();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  const cognitoId = authUser?.CognitoInfo?.userId;
  const userInfo = authUser?.userInfo;

  if (!cognitoId || !userInfo) {
    return (
      <div className="p-6 text-sm text-red-600">Unable to load settings.</div>
    );
  }

  const initialData = {
    name: userInfo.name,
    email: userInfo.email,
    phoneNumber: userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
      cognitoId: authUser?.CognitoInfo?.userId,
      ...data,
    }).unwrap();
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="manager"
    />
  );
};

export default ManagerSettings;
