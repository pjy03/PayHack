"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SetParameters() {
  const router = useRouter();
  const totalWeightage = 100; // Representing 100% as a whole number
  const defaultValue = (totalWeightage / 8).toFixed(2);

  // Custom parameter names
  const customParameterNames = [
    "Banker's Credit Scoring",
    "Transactional Behavior",
    "Loan Repayment Records",
    "Cash Flow Stability",
    "Debt Obligations",
    "Credit Utilization",
    "Demographics and Employment",
    "Behavioral Loan Insights",
  ];

  const handleSubmit = () => {
    alert("You have set the parameters.");
    router.push("/");
  };

  const [parameters, setParameters] = useState(
    customParameterNames.map((name, index) => ({
      id: index + 1,
      name: name, // Use custom name here
      defaultValue: defaultValue,
      isValid: true,
    }))
  );

  const handleInputChange = (id: number, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) return; // Ignore invalid inputs

    setParameters((prevParameters) => {
      // Step 1: Update the value for the specified parameter
      const updatedParameters = prevParameters.map((param) =>
        param.id === id
          ? { ...param, defaultValue: numericValue, isValid: true }
          : param
      );

      // Step 2: Validate that the total does not exceed 100%
      const total = updatedParameters.reduce(
        (sum, param) => sum + parseFloat(param.defaultValue),
        0
      );

      // Step 3: Mark parameter as invalid if total exceeds 100%
      if (total > totalWeightage) {
        return updatedParameters.map((param) =>
          param.id === id ? { ...param, isValid: false } : param
        );
      }

      return updatedParameters;
    });
  };

  const calculateRemainingWeightage = () => {
    const totalUsed = parameters.reduce(
      (sum, param) => sum + parseFloat(param.defaultValue),
      0
    );
    return Math.max(totalWeightage - totalUsed, 0).toFixed(2);
  };

  // Reset to default values
  const handleUseDefault = () => {
    setParameters(
      customParameterNames.map((name, index) => ({
        id: index + 1,
        name: name,
        defaultValue: defaultValue,
        isValid: true,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 sm:p-20">
      {/* Back Button */}
      <button
        className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 mb-5"
        onClick={() => router.push("/")}
      >
        Back
      </button>

      {/* Title */}
      <div className="flex flex-row justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Set Parameters</h1>
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
          onClick={handleUseDefault} // Handle resetting to default
        >
          Use Default
        </button>
      </div>

      {/* Parameters Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full border-collapse text-left table-auto">
          <thead>
            <tr>
              <th className="border-b-2 p-4 font-semibold text-gray-700 bg-blue-100">
                Parameter
              </th>
              <th className="border-b-2 p-4 font-semibold text-gray-700 bg-blue-100">
                Weightage (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr
                key={param.id}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-blue-50" : "bg-white"
                }`}
              >
                <td className="p-4 text-gray-800">{param.name}</td>
                <td className="p-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={param.defaultValue}
                    onChange={(e) =>
                      handleInputChange(param.id, e.target.value)
                    }
                    className={`w-full border text-black rounded-lg p-2 focus:outline-none focus:ring-2 ${
                      param.isValid
                        ? "focus:ring-blue-500 border-gray-300"
                        : "focus:ring-red-500 border-red-500"
                    }`}
                  />
                  {!param.isValid && (
                    <p className="text-red-500 text-sm mt-1">
                      Total weightage cannot exceed 100%.
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Remaining Weightage */}
      <div className="mt-6">
        <p className="text-gray-700 font-semibold">
          Remaining Weightage:{" "}
          <span
            className={`${
              calculateRemainingWeightage() < 0
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {calculateRemainingWeightage()}%
          </span>
        </p>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={
            parameters.some((param) => !param.isValid) ||
            calculateRemainingWeightage() !== "0.00"
          }
          onClick={handleSubmit}
        >
          Submit Parameters
        </button>
      </div>
    </div>
  );
}
