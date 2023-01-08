// Articles List Component

import React from "react";
import DeleteArticle from "./deleteArticle";
import UpdateArticle from "./updateArticle";

function Articles(props) {
  const { articles } = props;

  return (
    <>
      {articles.length === 0 ? (
        <p>No articles found!</p>
      ) : (
        articles.map(({ id, title, description, imageUrl, createdAt }) => (
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="border p-3 mb-3 mx-4 bg-light" key={id}>
              <div className="container">
                <div className="row my-2">
                  <div className="col-xl-4 col-lg-4">
                    <img
                      src={imageUrl}
                      alt="title"
                      style={{ height: 180, width: 180 }}
                    />
                  </div>

                  <div className="col-xl-8 col-lg-8">
                    <div className="mb-2">
                      <h3>{title}</h3>
                      <p>{createdAt.toDate().toDateString()}</p>
                      <h5>{description}</h5>
                      <UpdateArticle
                        articleId={id}
                        articleTitle={title}
                        articleDesc={description}
                        articleImage={imageUrl}
                      />
                      <DeleteArticle id={id} imageUrl={imageUrl} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default Articles;
