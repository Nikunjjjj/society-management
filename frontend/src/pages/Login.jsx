import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoLockClosedSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/ApiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginImage from "../assets/LoginImage.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const initialValues = {
    society_admin_number: "",
    society_admin_password: "",
  };

  const validationSchema = Yup.object().shape({
    society_admin_number: Yup.string()
      .matches(/^[0-9]+$/, "Contact number must be numeric")
      .min(10, "Contact number must be at least 10 digits")
      .max(15, "Contact number cannot exceed 15 digits")
      .required("Contact number is required"),
    society_admin_password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const result = await login(values).unwrap();
      console.log("Login successful:", result);

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setStatus({
        error: error?.data?.message || "Failed to login. Please try again.",
      });

      toast.error("Login failed! Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Image Section */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${LoginImage})` }}
      ></div>

      {/* Right Login Form Section */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md bg-white p-8 rounded-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Sign in to your account</h1>
            <h4 className="mb-6 text-gray-700 font-medium">
              Please enter your credentials
            </h4>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Contact Number Field */}
                <div className="relative">
                  <FaPhoneAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                  <Field
                    type="text"
                    id="society_admin_number"
                    name="society_admin_number"
                    placeholder="Mobile Number"
                    className="w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-2 border-b"
                  />
                  <ErrorMessage
                    name="society_admin_number"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <IoLockClosedSharp className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                  <Field
                    type="password"
                    id="society_admin_password"
                    name="society_admin_password"
                    placeholder="Password"
                    className="w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-2 border-b"
                  />
                  <ErrorMessage
                    name="society_admin_password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Signup Link */}
          <div className="text-center mt-6 text-lg">
            <p className="text-gray-700">
              Don’t have an account?{" "}
              <a
                onClick={() => navigate("/signup")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
