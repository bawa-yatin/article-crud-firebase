// Update Article Component

import { updateDoc, doc } from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import React, { useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function UpdateArticle({
  articleId,
  articleTitle,
  articleDesc,
  articleImage,
}) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    title: articleTitle,
    description: articleDesc,
    image: articleImage,
    newImage: "",
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    setFormData({ ...formData, newImage: e.target.files[0] });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleUpdate = async e => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Please fill all the fields");
      return;
    }

    if (formData.newImage == "") {
      const taskDocRef = doc(db, "articles", articleId);
      try {
        await updateDoc(taskDocRef, {
          title: formData.title,
          description: formData.description,
        });
        setShow(false);
        toast("Article updated successfully", { type: "success" });
      } catch (err) {
        toast("Error updating article", { type: "error" });
        console.log(err);
      }
    } else {
      const storageRef = ref(
        storage,
        `/images/${Date.now()}${formData.newImage.name}`
      );

      const uploadImage = uploadBytesResumable(storageRef, formData.newImage);

      uploadImage.on(
        "state_changed",
        snapshot => {
          const progressPercent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        err => {
          console.log(err);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then(url => {
            const articleRef = doc(db, "articles", articleId);
            updateDoc(articleRef, {
              title: formData.title,
              description: formData.description,
              imageUrl: url,
            })
              .then(() => {
                toast("Article updated successfully", { type: "success" });
                setShow(false);
              })
              .catch(err => {
                toast("Error updating article", { type: "error" });
                console.log(err);
              });
          });
        }
      );

      setFormData({
        title: formData.title,
        description: formData.description,
        image: formData.image,
        newImage: "",
      });
      const storageVar = ref(storage, articleImage);
      await deleteObject(storageVar);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{ marginRight: "10px" }}
      >
        Update
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Article</Modal.Title>
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
            type="text"
            className="form-control"
            value={
              formData.image
              //formData.newImage == "" ? formData.image : formData.newImage.name
            }
            readOnly
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-control mt-2"
            src={formData.image}
            onChange={e => handleImageChange(e)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
