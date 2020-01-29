const { admin, db } = require("../util/admin");
const config = require("../util/config");
//get all scream
exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc =>
        screams.push({
          screamId: doc.id,
          ...doc.data()
        })
      );
      return res.json(screams);
    })
    .catch(err => console.error(err));
};

//get scream
exports.getScream = (req, res) => {
  let screamData = {};
  return db
    .doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then(data => {
      screamData.comments = [];
      data.forEach(doc => {
        screamData.comments.push({
          commentId: doc.id,
          ...doc.data()});
      });
      return res.json(screamData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//like scream 
exports.likeScream = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
  .where('screamId', '==', req.params.screamId)

  const screamDocument = db.doc(`/screams/${req.params.screamId}`)

  let screamData

  screamDocument.get()
  .then(doc => {
    if(doc.exists) {
      screamData = doc.data()
      screamData.screamId = doc.id
      return likeDocument.get()
    } else return res.status(404).json({error: 'Scream not found'})
  })
  .then(data => {
    if(data.empty){
      return db.collection('likes').add({
        userHandle: req.user.handle,
        screamId: req.params.screamId
      })
      .then(() => {
        screamData.likeCount++
        return screamDocument.update({likeCount: screamData.likeCount})
      })
      .then(() => {
        return res.json(screamData)
      })
    }else res.status(400).json({error: 'Scream already liked'})
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({error: err.code})
  })

}

//unlike scream
exports.unlikeScream = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
  .where('screamId', '==', req.params.screamId)

  const screamDocument = db.doc(`/screams/${req.params.screamId}`)

  let screamData

  screamDocument.get()
  .then(doc => {
    if(doc.exists) {
      screamData = doc.data()
      screamData.screamId = doc.id
      return likeDocument.get()
    } else return res.status(404).json({error: 'Scream not found'})
  })
  .then(data => {
    if(data.empty){
      res.status(400).json({error: 'Scream not liked'})      
    }else return db.doc(`/likes/${data.docs[0].id}`).delete()
    .then(() => {
      screamData.likeCount--
      return screamDocument.update({likeCount: screamData.likeCount})
    })
    .then(() => {
      res.json(screamData)
    })  
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({error: err.code})
  })
}
exports.commentOneScream = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });
  let newComment = {
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId
  };
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: "Scream not found" });
      return doc.ref.update({commentCount: doc.data().commentCount + 1});
    })
    .then(() =>db.collection('comments').add(newComment)
    )
    .then(doc => {
      newComment.commentId = doc.id
      return res.json(newComment)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
// add scream
exports.postOneScreams = (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("screams")
    .add(newScream)
    .then(doc => {
      const resScream = newScream
      resScream.screamId = doc.id
      return res.json(resScream);
    })
    .catch(err => {
      res.status(500).json({ error: "soething went wrong" });
      console.error(err);
    });
};

exports.deleteScream = (req, res) => {
  const documentScream = db.doc(`/screams/${req.params.screamId}`)
  documentScream.get()
  .then(doc => {
    if(!doc.exists) return res.status(404).json({error: 'Scream not found'})
    if(doc.data().userHandle !== req.user.handle) return res.status(403).json({error: 'Unauthorized'})
    return documentScream.delete()
  })
  .then(() => {
    res.json({message: 'Scream deleted successfully'})
  })
  .catch(err => {
    console.error({error: err.code})
    res.status(500).json(err)
  })
}

exports.uploadImageFile = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUpload = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    // my.photo.png
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    //33412354235235.png
    imageFileName = `${Math.round(
      Math.random() * 10000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUpload = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUpload.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUpload.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return res.json(imageUrl);
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.postOneScreamWithImg = (req, res) => {
  const newScream = {
    body: req.body.body || '',
    image: req.body.imageUrl,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("screams")
    .add(newScream)
    .then(doc => {
      const resScream = newScream
      resScream.screamId = doc.id
      return res.json(resScream);
    })
    .catch(err => {
      res.status(500).json({ error: "soething went wrong" });
      console.error(err);
    });
};