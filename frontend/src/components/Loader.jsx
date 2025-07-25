import RotateLoader from "react-spinners/RotateLoader";

// components/Loader.jsx
export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <RotateLoader color="#ccccccff" loading={true} size={20} />
    </div>
  );
}
