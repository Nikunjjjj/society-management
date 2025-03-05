/* eslint-disable no-unused-vars */
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoLockClosedSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaPhoneAlt, FaHome } from "react-icons/fa";
import { useSignupMutation } from "../services/ApiService";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";

const SignUp = () => {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [logoPreview, setLogoPreview] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [societyMembers, setSocietyMembers] = useState([]);
  const [designation, setDesignation] = useState(null);
  const [formValues, setFormValues] = useState(null);
  const [status, setStatus] = useState({ error: null });

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
    society_logo: Yup.mixed()
      .nullable()
      .notRequired()
      .test("fileType", "Only image files are allowed", (value) => {
        return !value || (value && value.type.startsWith("image/"));
      }),
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

  const handleSubmit = async (values) => {
    setFormValues(values);

    const memberObject = {
      id: societyMembers.length + 1,
      society_admin_name: values.society_admin_name,
      society_admin_number: values.society_admin_number,
      designation: designation ?? "Society admin",
    };

    setShowTable(true);
    setSocietyMembers([...societyMembers, memberObject]);
  };

  const handleProceed = async () => {
    if (!formValues) {
      setStatus({ error: "Form data is missing. Please fill out the form." });
      return;
    }

    const payload = [
      {
        society_name: formValues.society_name,
        society_address: formValues.society_address,
        society_logo: formValues.society_logo ? formValues.society_logo : "",
        builder_name: formValues.builder_name,
        builder_number: formValues.builder_number,
        society_admin_name: formValues.society_admin_name,
        society_admin_number: formValues.society_admin_number,
        society_admin_password: formValues.society_admin_password,
        society_members: societyMembers,
      },
    ];

    console.log("payload", payload);

    try {
      const result = await signup(payload).unwrap();
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
    }
  };

  const [statuses] = useState([
    "SOCIETY ADMIN",
    "MEMBER",
    "SECURITY GUARD",
    "WATCHMAN",
    "HOUSE OWNER",
  ]);

  const getSeverity = (status) => {
    switch (status) {
      case "MEMBER":
        return "success";
      case "SOCIETY ADMIN":
        return "danger";
      case "SECURITY GUARD":
        return "success";
      case "WATCHMAN":
        return "success";
      case "HOUSE OWNER":
        return "success";
      default:
        return null;
    }
  };

  const onRowEditComplete = (e) => {
    let _members = [...societyMembers];
    let { newData, index } = e;

    _members[index] = newData;

    setSocietyMembers(_members);
    setDesignation(_members.map((item) => item.designation));
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)} />;
        }}
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.designation}
        severity={getSeverity(rowData.designation)}
      />
    );
  };

  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      {!showTable && (
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
                      const file = e.target.files[0] || null;
                      setFieldValue("society_logo", file);
                      setLogoPreview(file ? URL.createObjectURL(file) : null);
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
                  Next
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {showTable && (
        <>
          <div className="card">
            <DataTable
              value={societyMembers}
              editMode="row"
              dataKey="id"
              onRowEditComplete={onRowEditComplete}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="society_admin_name"
                header="Name"
                editor={(options) => textEditor(options)}
                style={{ width: "20%" }}
              />
              <Column
                field="designation"
                header="Designation"
                body={statusBodyTemplate}
                editor={(options) => statusEditor(options)}
                style={{ width: "20%" }}
              />
              <Column
                field="society_admin_number"
                header="Mobile Number"
                editor={(options) => textEditor(options)}
                style={{ width: "20%" }}
              />
              <Column
                rowEditor={allowEdit}
                headerStyle={{ width: "10%", minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
            </DataTable>
            <button className="text-blue-600 pt-2 ml-3 text-sm hover:underline cursor-pointer">
              Add More
            </button>
          </div>
          <div onClick={handleProceed} className="fixed bottom-4 right-4">
            <button className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600">
              Proceed
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SignUp;
