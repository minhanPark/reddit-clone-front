import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import cls from "classnames";
import { Post, Sub } from "../../types";
import Image from "next/image";
import { useAuthState } from "../../context/auth";
import Sidebar from "../../components/Sidebar";
import PostCard from "../../components/PostCard";

const SubPage = () => {
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
  const router = useRouter();
  const subName = router.query.sub;
  const {
    data: sub,
    error,
    mutate: subMutate,
  } = useSWR(subName ? `/subs/${subName}` : null, fetcher);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);

    try {
      await axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: { "Context-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      console.error(error);
    }
  };
  const openFileInput = (type: string) => {
    if (!ownSub) return;
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };
  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user?.username === sub.username);
  }, [sub]);
  let renderPosts;
  if (!sub) {
    renderPosts = <p className="text-lg text-center">로딩중 ...</p>;
  } else if (sub.posts.length === 0) {
    renderPosts = (
      <p className="text-lg text-center">아직 작성된 포스트가 없습니다.</p>
    );
  } else {
    renderPosts = sub.posts.map((post: Post) => (
      <PostCard key={post.identifier} post={post} subMutate={subMutate} />
    ));
  }
  return (
    <>
      {sub && (
        <>
          <div>
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            />
            <div
              className="bg-gray-400"
              onClick={() => openFileInput("banner")}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-56"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-gray-400"></div>
              )}
            </div>
            <div className="h-20 bg-white">
              <div className="relative flex max-w-5xl px-5 mx-auto">
                <div className="absolute" style={{ top: -15 }}>
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      alt="커뮤니티 이미지"
                      width={70}
                      height={70}
                      className="rounded-full"
                      onClick={() => openFileInput("image")}
                    />
                  )}
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-400">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            <div className="w-full md:mr-3 md:w-8/12">{renderPosts}</div>
            <Sidebar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
