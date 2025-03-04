"use client";
import { useState, useEffect } from "react";
import Image from "./Image";
import Link from "next/link";
interface UserResult {
  id: string;
  username: string;
  displayName: string | null;
  img: string | null;
}
const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);

  // 防抖处理
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim()) {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data.users);
        } catch (error) {
          console.error("搜索失败:", error);
        }
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="relative">
      <div className="bg-inputGray py-2 px-4 flex items-center gap-4 rounded-full">
        <Image path="icons/explore.svg" alt="search" w={16} h={16} />
        <input
          type="text"
          placeholder="搜索用户..."
          className="bg-transparent outline-none placeholder:text-textGray"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* 搜索结果容器 */}
      {results.length > 0 ? (
        <div className="absolute mt-2 w-full bg-black rounded-lg shadow-lg z-10 border border-borderGray">
          <div className="">
            {results.map((user) => (
              <Link
                key={user.id}
                href={`/${user.username}`}
                className="px-4 py-2 hover:bg-[#181818] cursor-pointer flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    path={user.img || "general/default.png"}
                    alt={user.username}
                    w={32}
                    h={32}
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {user.displayName || user.username}
                  </p>
                  <p className="text-sm text-textGray">@{user.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        query.trim() && (
          <div className="absolute mt-2 w-full bg-black rounded-lg shadow-lg z-10 border border-borderGray">
            <div className="px-4 py-3 text-textGray">没有找到相关用户</div>
          </div>
        )
      )}
    </div>
  );
};

export default Search;
