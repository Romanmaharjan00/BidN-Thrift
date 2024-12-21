import React, { forwardRef } from "react";

export const BillFormat = forwardRef((props, ref) => {
  let formattedDateTime=0;
  console.log("order", props.order);
  if (props?.order?.createdAt) {
    const expdate = new Date(props?.order?.createdAt).toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
    });
    const dateTimeString = expdate;

    // Splitting the date and time
    const [datePart, timePart] = dateTimeString.split(", ");

    // Splitting the date into components
    const [month, day, year] = datePart.split("/");

    // Adding leading zeros to month and day
    const formattedMonth = month.padStart(2, "0");
    const formattedDay = day.padStart(2, "0");

    // Splitting the time into components
    const [time, ampm] = timePart.split(" ");

    // Adjusting the time format
    const [hours, minutes, seconds] = time.split(":");
    let adjustedHours = hours;

    // Checking AM/PM and adjusting hours accordingly
    if (ampm === "PM") {
      adjustedHours = String(Number(hours) + 12).padStart(2, "0");
    } else {
      adjustedHours = adjustedHours.padStart(2, "0");
    }

    // Creating the formatted date and time
    formattedDateTime = `${year}-${formattedMonth}-${formattedDay} T ${adjustedHours}:${minutes}:${seconds}`;
  }

  const itemRows = props?.order?.orderItems.map((item, index) => {
    return (
      <tr key={index}>
        {
          <>
            <td className="pr-2">{index + 1}</td>
            <td className="pr-2">{item?.product?._id}</td>
            <td className="pr-2 max-w-[60px]">{item?.product?.title}</td>
            <td className="whitespace-nowrap text-right">
              {item?.product?.price}
            </td>
          </>
        }
      </tr>
    );
  });
  return (
    <div ref={ref}>
      <div
        className="flex flex-col justify-center items-center w-[17rem] p-4 pb-10 pr-6 border-black border-y-2 border-x-0 border-dashed m-auto mb-4 "
        ref={ref}
      >
        <div className="mb-4 flex flex-col justify-center items-center">
          <h1>Thriftbids</h1>
          <h2>Swoyambhu, Kathmandu</h2>
          <small className="text-xs">+977 9813643643</small>
        </div>
        <div className="mb-4 flex flex-col justify-center items-center w-full text-xs">
          <span className="text-start w-full">
            Order No: {props?.order?._id}
          </span>
          <span className="text-start w-full">Date: {formattedDateTime}</span>
          <span className="text-start w-full">
            Payment Mode: {props?.order?.shippingInfo?.paymentMethod}
          </span>
        </div>
        <table className="border-collapse w-full text-xs">
          <thead>
            <tr>
              <th className="border-t border-b border-dashed text-start pr-2 whitespace-nowrap">
                S.N
              </th>
              <th className="border-t border-b border-dashed text-start pr-2 whitespace-nowrap">
                Product Code
              </th>
              <th className="border-t border-b border-dashed text-start pr-2 whitespace-nowrap">
                Product Name
              </th>
              <th className="border-t border-b border-dashed text-right whitespace-nowrap">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>{itemRows}</tbody>

          <tfoot>
            <tr>
              <td
                colSpan={3}
                className="border-t border-b border-dashed font-bold py-1 whitespace-nowrap"
              >
                Total Amount :
              </td>
              <td className="border-t border-b border-dashed font-bold py-1 text-right">
                {props?.order?.totalprice}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="py-4 text-sm text-center">
          <p>NO EXCHANGE. NO REFUND.</p>
          <p>THANK YOU FOR SHOPPING WITH US</p>
        </div>
      </div>
    </div>
  );
});
