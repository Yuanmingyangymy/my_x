import { syncUser } from "@/action";
import Posts from "@/components/Posts";
import Share from "@/components/Share";
import toast from "react-hot-toast";

const Homepage = async () => {
  try {
    await syncUser();
  } catch (error) {
    toast.error("同步用户信息失败");
  }
  return (
    <div className="flex flex-col">
      {/* 发帖区 */}
      <Share />
      {/* 展示区 */}
      <Posts showAll={true} />
    </div>
  );
};

export default Homepage;
