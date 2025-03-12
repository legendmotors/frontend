import BlogDetails from "@/components/blogs/BlogDetails";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "",
  description: "",
};

export default function page({ params }) {
  // Assume the URL includes a slug parameter, e.g., /blog/[slug]
  const { slug } = params;
  return (
    <>
      <section className="flat-title mb-40">
        {/* <div className="container2">
          <div className="row">
            <div className="col-lg-12">
              <div className="title-inner style">
                <div className="title-group fs-12">
                  <Link className="home fw-6 text-color-3" href={`/`}>
                    Home
                  </Link>
                  <span>Cars</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </section>
      <BlogDetails slug={slug} />
      <Footer1 />
    </>
  );
}
