// Dashboard Page

import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { auth, db, logout, storage } from "../../config/firebase";
import {
  query,
  collection,
  getDocs,
  where,
  Timestamp,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Articles from "../Article/articles";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [info, setInfo] = useState([]);

  const [userId, setUserId] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: Timestamp.now().toDate(),
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [progress, setProgress] = useState(0);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description || !formData.image) {
      alert("Please fill all the fields");
      return;
    }

    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formData.image.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.image);

    uploadImage.on(
      "state_changed",
      snapshot => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      err => {
        console.log(err);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          image: "",
        });

        getDownloadURL(uploadImage.snapshot.ref).then(url => {
          const articleRef = collection(db, "articles");
          addDoc(articleRef, {
            title: formData.title,
            description: formData.description,
            imageUrl: url,
            userId: userId,
            createdAt: Timestamp.now().toDate(),
          })
            .then(() => {
              setProgress(0);
              setShow(false);
              toast("Article added successfully", { type: "success" });
            })
            .catch(err => {
              toast("Error adding article", { type: "error" });
            });
        });
      }
    );
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchUserArticles = async () => {
    try {
      const articleRef = collection(db, "articles");
      const results = query(articleRef, where("userId", "==", user?.uid));
      onSnapshot(results, snapshot => {
        const articles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInfo(articles);
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    fetchUserArticles();
    setUserId(user?.uid);
  }, [user, loading]);

  return isLoading ? (
    "Loading..."
  ) : (
    <>
      {/*<div className="dashboard">
        <div className="dashboard__container">
          Logged in as
          <div>{name}</div>
          <div>{user?.email}</div>
          <button className="dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>*/}

      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            Firebase App
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-md-auto gap-2">
              <li class="nav-item rounded">
                <div class="nav-link active" aria-current="page" href="#">
                  <FaUserAlt fill="#fff" />
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#fff",
                      position: "relative",
                      top: "3px",
                    }}
                  >
                    {name}
                  </span>
                </div>
              </li>

              <li class="nav-item rounded">
                <div class="nav-link active" onClick={logout}>
                  <MdLogout fill="#fff" />
                  <span
                    style={{
                      marginLeft: "8px",
                      color: "#fff",
                      position: "relative",
                      top: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <button
          type="button"
          class="btn btn-outline-primary my-4"
          onClick={handleShow}
          style={{ display: "block", marginRight: 0, marginLeft: "auto" }}
        >
          Add Article
        </button>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={e => handleChange(e)}
            />
          </div>

          <label htmlFor="">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={e => handleChange(e)}
          />

          <label htmlFor="">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-control"
            onChange={e => handleImageChange(e)}
          />

          {progress === 0 ? null : (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped mt-2"
                style={{ width: `${progress}%` }}
              >
                {`uploading image ${progress}%`}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePublish}>
            Publish
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container-fluid">
        <div className="row">
          <Articles articles={info} />
        </div>
      </div>

      {/*<div className="container">
        <div className="row my-5">
          <div className="col-md-8">
            <Articles articles={info} />
          </div>
          <div className="col-md-4">
            <div className="border p-3 bg-light" style={{ position: "fixed" }}>
              <>
                <h2>Create article</h2>
                <div className="form-group">
                  <label htmlFor="">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <label htmlFor="">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={e => handleChange(e)}
                />

                <label htmlFor="">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="form-control"
                  onChange={e => handleImageChange(e)}
                />

                {progress === 0 ? null : (
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped mt-2"
                      style={{ width: `${progress}%` }}
                    >
                      {`uploading image ${progress}%`}
                    </div>
                  </div>
                )}
                <button
                  className="form-control btn-primary mt-2"
                  onClick={handlePublish}
                >
                  Publish
                </button>
              </>
            </div>
          </div>
        </div>
      </div>*/}
    </>
  );
};

export default Dashboard;
