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
  const [isOpen, setIsOpen] = useState(false);

  // 防抖处理（保持不变）
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
    <>
      {/* 右下角浮动按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-iconBlue p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40"
      >
        <Image path="icons/explore.svg" alt="搜索" w={24} h={24} />
      </button>

      {/* 搜索弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
            <div className="bg-black p-6 rounded-2xl border border-borderGray">
              {/* 弹窗头部 */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">搜索用户</h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="p-2 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* 搜索输入框 */}
              <div className="bg-inputGray py-3 px-4 flex items-center gap-3 rounded-full mb-4">
                <Image path="icons/explore.svg" alt="search" w={20} h={20} />
                <input
                  type="text"
                  placeholder="输入用户名..."
                  className="bg-transparent outline-none placeholder:text-textGray flex-1 text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>

              {/* 搜索结果列表 */}
              {results.length > 0 ? (
                <div className="max-h-[60vh] overflow-y-auto">
                  {results.map((user) => (
                    <Link
                      key={user.id}
                      href={`/${user.username}`}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="px-4 py-3 hover:bg-inputGray cursor-pointer flex items-center gap-4 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          path={user.img || "general/default.png"}
                          alt={user.username}
                          w={40}
                          h={40}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-lg">
                          {user.displayName || user.username}
                        </p>
                        <p className="text-textGray">@{user.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="text-center py-6 text-textGray">
                  没有找到相关用户
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
