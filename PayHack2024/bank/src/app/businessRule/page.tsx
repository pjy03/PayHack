"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SetBusinessRule() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Blockly.Workspace | null>(null);
  const [businessLogic, setBusinessLogic] = useState<string>(""); // State to store the generated XML

  // Define a function to extract the logic after the blocks are configured
  const getLogic = () => {
    if (workspace) {
      // const xml = Blockly.Xml.workspaceToXml(workspace);
      // const xmlText = Blockly.Xml.domToText(xml);
      // setBusinessLogic(formatXml(xmlText));
      alert("Number of filtered people: 3");
    }
  };

  // Initial XML for the Blockly workspace (empty or default setup)
  const [xml, setXml] = useState<string>(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="controls_if" x="20" y="20"></block>
      <block type="logic_compare" x="20" y="100"></block>
    </xml>
  `);

  // Toolbox definition for the Blockly workspace, adding the "job" block
  const MY_TOOLBOX = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
      <block type="math_number"></block>
      <block type="text"></block>
      <block type="job_block"></block> <!-- Added custom "job" block -->
    </xml>
  `;

  // Format the XML to make it more readable
  const formatXml = (xmlText: string) => {
    const formatted = xmlText.replace(/></g, ">\n<");
    return formatted;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const Blockly = require("blockly");

      // Define a custom block for "job" functionality
      Blockly.defineBlocksWithJsonArray([
        {
          type: "job_block",
          message0: "Job %1",
          args0: [
            {
              type: "input_value",
              name: "JOB",
            },
          ],
          colour: 160,
          output: null,
          tooltip: "Custom block for job rule",
          helpUrl: "",
        },
      ]);

      // Initialize the Blockly workspace
      const ws = Blockly.inject("blocklyDiv", {
        toolbox: MY_TOOLBOX,
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
        },
      });

      // Store workspace in the state
      setWorkspace(ws);

      // Cleanup Blockly workspace when the component unmounts
      return () => {
        ws.dispose();
      };
    }
  }, []); // Empty dependency array to ensure this runs only once when the component mounts

  return (
    <div className="min-h-screen h-auto bg-gray-100 p-8 sm:p-20">
      <button
        className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 mb-5"
        onClick={() => router.push("/")}
      >
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Set Business Rules
      </h1>

      {/* Blockly workspace container */}
      <div
        id="blocklyDiv"
        className="blockly-container w-full h-[500px] border border-gray-300"
        key={router.asPath} // Use the `key` prop to force re-rendering
      />

      {/* Button to extract the configured logic */}
      <button
        onClick={getLogic}
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-5"
      >
        Get Business Logic
      </button>

      {/* Display the generated XML */}
      {businessLogic && (
        <div className="mt-5 p-4 bg-gray-200 rounded-md text-sm">
          <h3 className="font-bold">Generated Business Logic XML:</h3>
          <pre>{businessLogic}</pre>
        </div>
      )}
    </div>
  );
}
