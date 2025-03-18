import { SiTicktick } from "react-icons/si";

const EmailVerification = () => {
  return (
    <div className="flex text-center items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <SiTicktick className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            Thank you for signing in
          </h1>

          <h2 className="text-xl font-semibold mb-4">
            Verify your email address
          </h2>

          <p className="text-gray-500 mb-8">
            Please confirm that you want to use this as your email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
