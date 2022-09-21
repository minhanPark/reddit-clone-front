import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { Comment, Post } from "../../types";
import Image from "next/image";
import dayjs from "dayjs";

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR(username ? `/users/${username}` : null);
  if (!data) return null;
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">
        {data.userData.map((data: any) => {
          if (data.type === "Post") {
            const post: Post = data;
            return <PostCard key={post.identifier} post={post} />;
          } else {
            const comment: Comment = data;
            return (
              <div
                key={comment.identifier}
                className="flex my-4 bg-white rounded"
              >
                <div className="flex-shrink-0 w-10 py-10 text-center bg-gray-200 rounded-l">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </div>
                <div className="w-full p-2">
                  <p className="mb-2 text-xs text-gray-500">
                    <Link href={`/u/${comment.username}`}>
                      <a className="cursor-pointer hover:underline">
                        {comment.username}
                      </a>
                    </Link>
                    <span>commented on</span>
                    <Link href={`/u/${comment.post?.url}`}>
                      <a className="cursor-pointer hover:underline font-semibold">
                        {comment.post?.title}
                      </a>
                    </Link>
                    <span>*</span>
                    <Link href={`/u/${comment.post?.subName}`}>
                      <a className="text-black cursor-pointer hover:underline">
                        /r/{comment.post?.subName}
                      </a>
                    </Link>
                  </p>
                  <hr />
                  <p className="p-1">{comment.body}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="flex items-center p-3 bg-gray-400 rounded-t">
          <Image
            src="https://www.gravatar.com/avatar/0000?d=mp&f=y"
            alt="user profile"
            className="mx-auto border border-white rounded-full"
            width={40}
            height={40}
          />
          <p className="pl-2 text-md">{data.user.username}</p>
        </div>
        <div>{dayjs(data.user.createdAt).format("YYYY.MM.DD")}</div>
      </div>
    </div>
  );
};

export default UserPage;
