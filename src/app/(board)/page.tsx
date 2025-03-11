import { syncUser } from "@/action";
import Posts from "@/components/Posts";
import Share from "@/components/Share";
import { currentUser } from "@clerk/nextjs/server";

const Homepage = async () => {
  const user = await currentUser();

  if (user) await syncUser();
  return (
    <div className="flex flex-col">
      {/* 发帖区 */}
      <Share />
      {/* 展示区 */}
      <Posts />
    </div>
  );
};

export default Homepage;
