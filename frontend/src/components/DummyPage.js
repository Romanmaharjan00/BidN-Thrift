import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { ComponentToPrint } from "./ComponentToPrint";

const DummyPage = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <ComponentToPrint ref={componentRef} />
      <button
        size="small"
        onClick={(e) => {
          handlePrint();
        }}
        className="text-sm text-gray-700"
      >
        print
      </button>
    </div>
  );
};

export default DummyPage;
