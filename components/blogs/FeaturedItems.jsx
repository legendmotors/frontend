import { blogPosts3 } from "@/data/blogs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function FeaturedItems() {
  return (
    <div className="widget widget-listings style">
      <h3 className="widget-title title-list">Featured listings</h3>
      {blogPosts3.map((post, index) => (
        <div key={index} className="box-listings flex hover-img3">
          <div className="img-listings img-style3">
            <Image
              alt="blog image"
              src={post.imgSrc}
              width={224}
              height={148}
            />
          </div>
          <div className="content link-style-1">
            <Link className="fs-16 lh-22 fw-5" href={`/blog/${post.id}`}>
              {post.title}
            </Link>
            <span className="date">
              <i className="fal fa-calendar" />
              {post.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
