import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoLockClosedSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { useSignupMutation } from "../services/ApiService";

const SignUp = () => {
  const navigate = useNavigate();

  const [signup, { isLoading }] = useSignupMutation();

  const initialValues = {
    name: "",
    contact_number: "",
    complex_number: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    contact_number: Yup.string()
      .matches(/^[0-9]+$/, "Contact number must be numeric")
      .min(10, "Contact number must be at least 10 digits")
      .max(15, "Contact number cannot exceed 15 digits")
      .required("Contact number is required"),
    complex_number: Yup.string()
      .matches(/^[0-9]+$/, "Complex number must be numeric")
      .required("Complex number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const result = await signup(values).unwrap();
      console.log("Signup successful:", result);

      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      navigate("/dashboard");
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
            Please enter your Details
          </h4>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="relative name">
                <MdDriveFileRenameOutline className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="name"
                  id="name"
                  name="name"
                  placeholder="Name"
                  className="w-full border-gray-300 rounded-md  focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="relative contact numer">
                <FaPhoneAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="contact_number"
                  id="contact_number"
                  name="contact_number"
                  placeholder="contact number"
                  className="w-full border-gray-300 rounded-md  focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="contact_number"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="relative complex number">
                <FaHome className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="complex_number"
                  id="complex_number"
                  name="complex_number"
                  placeholder="complex number"
                  className="w-full border-gray-300 rounded-md  focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="complex_number"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="relative email">
                <MdEmail className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border-gray-300 rounded-md  focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="relative mb-15 password">
                <IoLockClosedSharp className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border-gray-300 rounded-md  focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-2 border-b"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting || isLoading ? "Signing up..." : "Sign up"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-6 text-lg">
          <p className="text-gray-700 cursor-pointer">
            Don&lsquo;t have an account?{" "}
            <a
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
