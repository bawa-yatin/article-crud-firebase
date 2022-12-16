import React from "react";
import { Link } from "react-router-dom";
import DeleteArticle from "./deleteArticle";
import UpdateArticle from "./updateArticle";

function Articles(props) {
  const { articles } = props;

  return (
    <div>
      {articles.length === 0 ? (
        <p>No articles found!</p>
      ) : (
        articles.map(({ id, title, description, imageUrl, createdAt }) => (
          <div className="border p-3 mb-3 bg-light" key={id}>
            <div className="row">
              <div className="col-3">
                <Link to={`/article/${id}`}>
                  <img
                    src={imageUrl}
                    alt="title"
                    style={{ height: 180, width: 180 }}
                  />
                </Link>
              </div>

              <div className="col-9 ps-3">
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
        ))
      )}
    </div>
  );
}

export default Articles;
