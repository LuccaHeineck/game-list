import PacmanLoader from "react-spinners/PacmanLoader";

// components/Loader.jsx
export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <PacmanLoader color="#ccccccff" loading={true} size={20} />
    </div>
  );
}
