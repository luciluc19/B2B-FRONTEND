import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";

const Whatsapp = () => {
  return (
    <div>
      <FloatingWhatsApp
        phoneNumber="+32488056232"
        accountName="Delaware support"
        avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPBqAOQhpbb8mYBZiCv3WPum0MjflrbzxR-rOrjUVmKbtM6SVz7HBNZV6Wm_nzcgPqGU0&usqp=CAU"
      />
    </div>
  );
};

export default Whatsapp;
