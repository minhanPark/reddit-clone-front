import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import useSWR from "swr";
import { useAuthState } from "../../../../context/auth";
import { Post, Comment } from "../../../../types";

const PostPage = () => {
  const router = useRouter();
  const { authenticated, user } = useAuthState();
  const [newComment, setNewComment] = useState("");
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  const { data: comments } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );
  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;
    try {
      await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
        body: newComment,
      });
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };
  console.log({ comments });
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">
        <div className="bg-white rounded">
          {post && (
            <>
              <div className="flex">
                <div className="py-2 pr-2">
                  <div className="flex items-center">
                    <p className="text-xs text-gray-400">
                      Posted by
                      <Link href={`/u/${post.username}`}>
                        <a className="mx-1 hover:underline">
                          /u/{post.username}
                        </a>
                      </Link>
                      <Link href={post.url}>
                        <a className="mx-1 hover:underline">
                          {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                        </a>
                      </Link>
                    </p>
                  </div>
                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  <p className="my-3 text-sm">{post.body}</p>
                  <div className="flex">
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                        />
                      </svg>
                      <span className="font-bold">
                        {post.commentCount} Comments
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {/* 댓글 작성 구간 */}
              <div className="pr-6 mb-4">
                {authenticated ? (
                  <div>
                    <p className="mb-1 text-xs">
                      <Link href={`/u/${user?.username}`}>
                        <a className="font-semibold text-blue-500">
                          {user?.username}
                        </a>
                      </Link>{" "}
                      으로 작성
                    </p>
                    <form onSubmit={submitComment}>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          className="px-3 py-1 text-white bg-gray-400 rounded"
                          disabled={newComment.trim() === ""}
                        >
                          댓글 작성
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                    <p className="font-semibold text-gray-400">
                      댓글 작성을 위해서 로그인 해주세요.
                    </p>
                    <div>
                      <Link href="/login">
                        <a className="px-3 py-1 text-white bg-gray-400 rounded">
                          로그인
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {/* 댓글작성 */}
              {comments?.map((comment) => (
                <div className="flex" key={comment.identifier}>
                  <div className="py-2 pr-2">
                    <p className="mb-1 text-xs leading-none">
                      <Link href={`/u/${comment.username}`}>
                        <a className="mr-1 font-bold hover:underline">
                          {comment.username}
                        </a>
                      </Link>
                      <span className="text-gray-600">
                        {`${comment.voteScore} posts ${dayjs(
                          comment.createdAt
                        ).format("YYYY-MM-DD HH:mm")}`}
                      </span>
                    </p>
                    <p>{comment.body}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
