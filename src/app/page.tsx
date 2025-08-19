import Link from "next/link";

export default function Home() {
  return (
  <>
    <h1>
      <Link href={"/auth"}>auth</Link>
      
    </h1>
  </>
  );
}
