import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function PrintPdf() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Visitor Pass",
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  });

  return (
    <div>
      <div ref={componentRef}></div>
      <button onClick={handlePrint}>Print this out!</button>
    </div>
  );
}
