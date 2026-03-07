import Image from "next/image";
import logo from "../../../public/ChatGPT_Image_Mar_7__2026__05_01_02_PM-removebg-preview.png"
const ReadMartLogo = ({ width = 80 }) => {
  return (
    <Image
      src={logo}
      alt="Read On Route Logo"
      width={width}
      style={{ height: "auto" }}
      priority
    />
  );
};

export default ReadMartLogo;