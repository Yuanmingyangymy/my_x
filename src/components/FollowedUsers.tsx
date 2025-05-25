import Link from "next/link";
import Image from "./Image";

type User = {
  id: string;
  username: string;
  displayName: string | null;
  img: string | null;
};

export default function FollowedUsers({ users }: { users: User[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/${user.username}`}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image
              path={user.img || "general/default.png"}
              alt={user.username}
              w={64}
              h={64}
            />
          </div>
          <span className="text-sm text-center">{user.username}</span>
        </Link>
      ))}
    </div>
  );
}
