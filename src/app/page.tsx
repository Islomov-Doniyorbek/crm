
import Link from "next/link";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
  <>
      
      <button className="px-3 py-2 bg-blue-700 cursor-pointer relative top-3.5 left-3.5">
        <Link className="text-amber-50" href={"/auth"}>Auth</Link>
      </button>
      {/* <Dashboard /> */}
  </>
  );
}
