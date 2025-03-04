import Posts from "@/components/Posts";
import Share from "@/components/Share";

const Homepage = () => {
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
