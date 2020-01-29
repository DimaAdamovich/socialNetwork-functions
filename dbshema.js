let db = {
  screams: [
    {
      userHandle: "user",
      body: "scream body",
      createdAt: "2019-11-17T20:47:44.284Z",
      lekeCount: 2,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "5bv",
      screamId: 'wcregvwtgey345b',
      body: 'nice app',
      createdAt: "2019-11-19T12:39:00.867Z"
    }
  ],
  users: [
    {
      userId: "IABy07v68yQbfFt51t86exkU8LC2",
      email: "user4@email.com",
      createdAt: "2019-11-19T12:39:00.867Z",
      handle: "user4",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/socialnetwork-fd235.appspot.com/o/1229051091.png?alt=media",
      bio: "I`m software developer",
      website: "https://vk.com",
      location: "Belarus"
    }
  ],
  notification: [
      {
          recipient: 'user',
          sender: 'john',
          read: 'true | false',
          screamId: 'isNt2djyjpMEOb98AEoN',
          type: 'like | comment',
          createdAt: '2019-11-19T12:39:00.867Z'
      }
  ]
};

const userDetails = {
  //Redux data
  credentials: {
    userId: "IABy07v68yQbfFt51t86exkU8LC2",
    email: "user4@email.com",
    createdAt: "2019-11-19T12:39:00.867Z",
    handle: "user4",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/socialnetwork-fd235.appspot.com/o/1229051091.png?alt=media",
    bio: "I`m software developer",
    website: "https://vk.com",
    location: "Belarus"
  },
  likes: [
    {
      userHandle: "user",
      screamId: "B4Bt4tIfNWyjd2fECU4m"
    },
    {
      userHandle: "user",
      screamId: "HXK6gW9jsc835HES2Ujz"
    }
  ]
};
