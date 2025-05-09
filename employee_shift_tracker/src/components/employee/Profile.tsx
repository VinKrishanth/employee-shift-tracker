import { User, Mail, MapPin, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    salutation: "",
    name: "",
    lastName: "",
    birthName: "",
    nationality: "",
    job: "",
    email: "",
    telephoneNumber: "",
    bankDetails: {
      branchName: "",
      bankName: "",
      accountNumber: "",
    },
    address: {
      street: "",
      city: "",
      pinCode: "",
    },
  });

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      try {
        const response = await axios.get("/api/auth/employees/profile", {
          params: { id: user?.id },
        });
        if (response.data.success) {
          setFormData(response.data.profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    if (user?.id) {
      fetchEmployeeProfile();
    }
  }, [user?.id]);

  const labelClass = "block cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md  bg-sky-100/30 dark:bg-gray-800 text-black dark:text-white focus:outline-none  ";

  const renderFields = (fields: { label: string; value: string }[], cols = 3) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols} gap-4`}>
      {fields.map(({ label, value }, index) => (
        <div key={index}>
          <label className={labelClass}>{label}</label>
          <input value={value} readOnly type="text" className={inputClass} />
        </div>
      ))}
    </div>
  );

  return (
    <form className="space-y-8 sm:px-4 mt-4 mb-10 ">
      <Card className="sm:border border-0 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderFields(
            [
              { label: "Salutation", value: formData.salutation },
              { label: "Birth Name", value: formData.birthName },
              { label: "First Name", value: formData.name },
              { label: "Last Name", value: formData.lastName },
              { label: "Nationality", value: formData.nationality },
              { label: "Role", value: formData.job },
            ],
            3
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFields(
              [
                { label: "Street", value: formData.address.street },
                { label: "City", value: formData.address.city },
                { label: "Pin Code", value: formData.address.pinCode },
              ],
              2
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <Mail className="h-5 w-5" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFields(
              [
                { label: "Email", value: formData.email },
                { label: "Phone", value: formData.telephoneNumber },
              ],
              2
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <CreditCard className="h-5 w-5" />
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFields(
              [
                { label: "Branch Name", value: formData.bankDetails.branchName },
                { label: "Bank Name", value: formData.bankDetails.bankName },
                { label: "Account Number", value: formData.bankDetails.accountNumber },
              ],
              3
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
