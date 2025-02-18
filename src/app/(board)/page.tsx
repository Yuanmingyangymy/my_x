import Posts from "@/components/Posts";
import Share from "@/components/Share";
import Link from "next/link";

const Homepage = () => {
  return (
    <div className="flex flex-col">
      {/* tab */}
      <div className="flex justify-around items-center border-b-[1px] border-borderGray">
        <Link href="/" className="text-textGray py-4">
          For you
        </Link>
        <Link href="/" className="py-4 font-bold border-b-4 border-iconBlue">
          Following
        </Link>
      </div>
      {/* create a new post */}
      <Share />
      {/* Posts display area */}
      <Posts />
    </div>
  );
};

export default Homepage;
