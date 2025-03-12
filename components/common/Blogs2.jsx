"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BlogService from "@/services/BlogService"; // Adjust path as needed

export default function Blogs2({ title }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blog posts on mount (limit 4 posts for this preview layout)
  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        // Fetch page 1 with 4 posts – adjust params as needed
        const response = await BlogService.listBlogPosts({ page: 1, limit: 4 });
        if (response?.success) {
          setBlogPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blogPosts.length) {
    return <div>No blog posts available</div>;
  }

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1, 4);

  return (
    <section className="section-blog tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2
                className="wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                {title}
              </h2>
              <Link
                href="/blog"
                className="tf-btn-arrow wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="blog-article-left">
              <div className="blog-article-item hover-img">
                <div className="images img-style relative flex-none">
                  {featuredPost.coverImage?.original && (
                    <Image
                      alt={featuredPost.title}
                      src={
                        process.env.NEXT_PUBLIC_FILE_PREVIEW_URL +
                        featuredPost.coverImage.webp
                      }
                      width={945}
                      height={623}
                    />
                  )}
                  <div className="date">
                    {new Date(featuredPost.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="content">
                  <div className="sub-box flex align-center fs-13 fw-6">
                    <a href="#" className="admin fw-7 text-color-2">
                      {featuredPost.author?.firstName}{" "}
                      {featuredPost.author?.lastName}
                    </a>
                    <a href="#" className="category text-color-3">
                      {featuredPost.category?.name}
                    </a>
                  </div>
                  <h3>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p>{featuredPost.excerpt}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="blog-article-right">
              {otherPosts.map((post, i) => (
                <div
                  key={i}
                  className="blog-article-item style3 hover-img wow fadeInUpSmall"
                  data-wow-delay="0.2s"
                  data-wow-duration="1000ms"
                >
                  <div className="images img-style relative flex-none">
                    {post.coverImage?.original && (
                      <Image
                        alt={post.title}
                        src={
                          process.env.NEXT_PUBLIC_FILE_PREVIEW_URL +
                          post.coverImage.webp
                        }
                        width={285}
                        height={188}
                      />
                    )}
                  </div>
                  <div className="content">
                    <div className="sub-box flex align-center flex-wrap fs-13 fw-6">
                      <a href="#" className="admin fw-7 text-color-2">
                        {post.author?.firstName} {post.author?.lastName}
                      </a>
                      <a href="#" className="category text-color-3 fw-4">
                        {post.category?.name}
                      </a>
                      <a href="#" className="date fw-4 fs-12 font-2">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </a>
                    </div>
                    <h3>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p>{post.excerpt}</p>
                  </div>
                </div>
              ))}

              <div
                className="flat-bt-top wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                <Link className="sc-button btn-1" href="/blog">
                  <span>View all news</span>
                  <i className="icon-autodeal-next" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
