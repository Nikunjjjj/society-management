import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoLockClosedSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaPhoneAlt, FaHome } from "react-icons/fa";
import { useSignupMutation } from "../services/ApiService";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [logoPreview, setlogoPreview] = useState(null);

  const initialValues = {
    society_name: "",
    society_address: "",
    society_logo: null,
    builder_name: "",
    builder_number: "",
    society_admin_name: "",
    society_admin_number: "",
    society_admin_password: "",
  };

  const validationSchema = Yup.object().shape({
    society_name: Yup.string().required("Society name is required"),
    society_address: Yup.string().required("Society address is required"),
    society_logo: Yup.mixed().test(
      "fileType",
      "Only image files are allowed",
      (value) => value === null || (value && value.type.startsWith("image/"))
    ),
    builder_name: Yup.string().required("Builder name is required"),
    builder_number: Yup.string()
      .matches(/^[0-9]+$/, "Contact number must be numeric")
      .min(10, "Must be at least 10 digits")
      .max(15, "Cannot exceed 15 digits")
      .required("Builder contact number is required"),
    society_admin_name: Yup.string().required("Society admin name is required"),
    society_admin_number: Yup.string()
      .matches(/^[0-9]+$/, "Contact number must be numeric")
      .min(10, "Must be at least 10 digits")
      .max(15, "Cannot exceed 15 digits")
      .required("Society admin contact number is required"),
    society_admin_password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    const formData = new FormData();

    formData.append("society_name", values.society_name);
    formData.append("society_address", values.society_address);
    if (values.society_logo) {
      formData.append("society_logo", values.society_logo);
    }
    formData.append("builder_name", values.builder_name);
    formData.append("builder_number", values.builder_number);
    formData.append("society_admin_name", values.society_admin_name);
    formData.append("society_admin_number", values.society_admin_number);
    formData.append("society_admin_password", values.society_admin_password);

    try {
      const result = await signup(formData).unwrap();
      console.log("Signup successful:", result);

      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setStatus({
        error:
          error.data?.message || "Failed to create account. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-full max-w-md bg-white p-8 rounded-lg ">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
          <h4 className="mb-6 text-gray-700 font-medium">
            Please enter your details
          </h4>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue, status }) => (
            <Form className="space-y-4">
              {/* Society Name */}
              <div className="relative">
                <MdDriveFileRenameOutline className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="text"
                  name="society_name"
                  placeholder="Society Name"
                  className="w-full border-b rounded-md pl-10 py-2 border-gray-300"
                />
                <ErrorMessage
                  name="society_name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Society Address */}
              <div className="relative">
                <FaHome className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="text"
                  name="society_address"
                  placeholder="Society Address"
                  className="w-full border-gray-300 rounded-md pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="society_address"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Society Logo */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFieldValue("society_logo", file);
                    setlogoPreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full border-gray-300 rounded-md p-2 border-b"
                />
                {values.society_logo && (
                  <p className="mt-1 text-gray-600 text-sm">
                    {values.society_logo.name}
                  </p>
                )}
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="mt-2 h-16 w-16 object-cover rounded"
                  />
                )}

                <ErrorMessage
                  name="society_logo"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Builder Name */}
              <div className="relative">
                <MdDriveFileRenameOutline className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="text"
                  name="builder_name"
                  placeholder="Builder Name"
                  className="w-full border-gray-300 rounded-md pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="builder_name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Builder Number */}
              <div className="relative">
                <FaPhoneAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="text"
                  name="builder_number"
                  placeholder="Builder Contact Number"
                  className="w-full border-gray-300 rounded-md pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="builder_number"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Society Admin Name */}
              <div className="relative">
                <MdDriveFileRenameOutline className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="text"
                  name="society_admin_name"
                  placeholder="Society Admin name"
                  className="w-full border-gray-300 rounded-md pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="society_admin_name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Society Admin Number */}
              <div className="relative">
                <FaPhoneAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="text"
                  name="society_admin_number"
                  placeholder="Society Admin Contact Number"
                  className="w-full border-gray-300 rounded-md pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="society_admin_number"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <IoLockClosedSharp className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="password"
                  name="society_admin_password"
                  placeholder="Password"
                  className="w-full border-gray-300 rounded-md pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="society_admin_password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {status?.error && (
                <div className="text-red-500 text-sm">{status.error}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600"
              >
                {isSubmitting || isLoading ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
