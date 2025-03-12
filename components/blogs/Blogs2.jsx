"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination2 from "../common/Pagination2";
import ShareButton from "../social/ShareButton";
import BlogService from "@/services/BlogService"; // Adjust path as needed

export default function Blogs2() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);

  // Fetch blog posts when currentPage or pageSize changes
  useEffect(() => {
    fetchBlogPosts(pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage, pagination.pageSize]);

  const fetchBlogPosts = async (page, limit) => {
    setLoading(true);
    try {
      // BlogService.listBlogPosts should call your API and return the response object
      const response = await BlogService.listBlogPosts({ page, limit });
      if (response?.success) {
        setBlogPosts(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="tf-section3 flat-blog-grid flat-blog-list flat-property">
      <div className="container">
        <div className="inner-heading flex-two flex-wrap">
          <h1 className="heading-listing">Our News</h1>
          <ShareButton />
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="post">
              <div className="flat-blog">
                <div className="row">
                  {blogPosts.map((post, index) => (
                    <div className="col-lg-4 col-md-6" key={index}>
                      <div className="box hover-img">
                        <div className="images img-style relative flex-none">
                          {post.coverImage?.original && (
                            <Image
                              alt={post.title}
                              src={process.env.NEXT_PUBLIC_FILE_PREVIEW_URL + post.coverImage.webp}
                              width={820}
                              height={540}
                            />
                          )}
                          <div className="date">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="content">
                          <div className="sub-box flex align-center fs-13 fw-6">
                            <a href="#" className="admin fw-7 text-color-2">
                              {post.author?.firstName} {post.author?.lastName}
                            </a>
                            <a href="#" className="category text-color-3">
                              {post.category?.name}
                            </a>
                          </div>
                          <h3>
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <p>{post.excerpt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="themesflat-pagination clearfix center">
                <ul>
                  <Pagination2
                    totalItems={pagination.totalItems}
                    itemPerPage={pagination.pageSize}
                    currentPage={pagination.currentPage}
                    onPageChange={handlePageChange}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
