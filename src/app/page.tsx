import Link from "next/link";

export default function Home() {
  return (
  <>
    <h1>
      <Link href={"/auth"}>auth</Link>
      <div className="container">
        <h2>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt, perspiciatis sunt voluptatibus harum necessitatibus fuga eligendi doloribus distinctio cupiditate saepe culpa provident, voluptatem temporibus ut voluptatum laboriosam quibusdam. Nam alias magnam nihil. Quia eaque deleniti, cumque nemo velit sapiente autem culpa vel error, accusantium sed quos. Voluptatem dolor, quisquam aspernatur eos aut omnis aliquid? Minima, voluptatem itaque atque totam placeat blanditiis dolor voluptate fugiat libero adipisci recusandae doloribus! Fuga ut pariatur iusto asperiores architecto consequatur iste at alias fugiat.</h2>
      </div>
    </h1>
  </>
  );
}
