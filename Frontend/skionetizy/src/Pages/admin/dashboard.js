import React from "react";
import styles from "./Dashboard.module.css";
import BlogCard from "../../Components/BlogCard";
import Slider from "../../Components/Slider";
import Spinner from "../../Components/Spinner";
import useAsync from "../../hooks/useAsync";
import errorToObject from "../../utils/errorToObject";

function Dashboard() {
  const blogs = useAsync(
    () => {
      return new Promise((res) => setTimeout(() => res(blogsData), 0))
        .then((res) => {
          return res.blogs;
        })
        .catch((err) => alert(errorToObject(err).message));
    },
    [],
    []
  );

  const today = new Date().toLocaleDateString("en-IN");

  return (
    <div className={styles.container}>
      {blogs.isLoading ? (
        <p>
          Loading <Spinner />
        </p>
      ) : blogs.isError ? (
        <p>{JSON.stringify(blogs.error)}</p>
      ) : blogs.data?.length > 0 ? (
        <>
          <p className={styles.blogPublishedDate}>{today}</p>
          <Slider>
            {blogs.data.map((blog) => (
              <BlogCard isAdmin={true} blog={blog} />
            ))}
          </Slider>

          <p className={styles.blogPublishedDate}>{today}</p>
          <Slider>
            {blogs.data.map((blog) => (
              <BlogCard isAdmin={true} blog={blog} />
            ))}
          </Slider>

          <p className={styles.blogPublishedDate}>{today}</p>
          <Slider>
            {blogs.data.map((blog) => (
              <BlogCard isAdmin={true} blog={blog} />
            ))}
          </Slider>
        </>
      ) : (
        <p>No blogs</p>
      )}
    </div>
  );
}

const blogsData = {
  blogs: [
    {
      _id: { $oid: "60b33004d325b7158af1071f" },
      blogDescription:
        "asdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa.",
      blogID: "e6aacb55-b75f-4820-b851-e66827a6035a",
      blogImageURL:
        "http://res.cloudinary.com/dd8470vy4/image/upload/riocf3m3ne3jvlguocnk",
      blogStatus: "PUBLISHED",
      blogTitle: "from scratch 11",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 1,
      likedByUsersList: [],
      likesCount: 5,
      profileID: "96f59486-18b4-4f03-8923-9e4571e8e6b5",
      profileName: "rohan devaki",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/di9tmwjf9uwdjzjhk32w",
      timestamp: { $date: 1633187473509 },
      viewCount: 57,
    },
    {
      _id: { $oid: "610982f722c57d0170a580d5" },
      blogDescription:
        "My Trial Blog for Feed Testing,yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
      blogID: "e07f3d0d-eb8e-4d4e-b04d-e3d3ba7e860d",
      blogImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/tedyg2kmtgw7dkrhcq9r",
      blogStatus: "PUBLISHED",
      blogTitle: "Adithya Blog 1",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 0,
      likedByUsersList: [],
      likesCount: 1,
      profileID: "d6b57507-a31c-4553-b187-e5710897d233",
      profileName: "Adithya Narayan",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/v1628924598/Profile_Pic_male_mg0kie.jpg",
      timestamp: { $date: 1628013303709 },
      viewCount: 8,
    },
    {
      _id: { $oid: "611a175a3330d2d91b1e2f70" },
      blogDescription:
        "Jingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola Yokerajkaza",
      blogID: "6fd0db9c-0eb7-4f7c-967c-23b34dde813d",
      blogImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/tedyg2kmtgw7dkrhcq9r",
      blogStatus: "PUBLISHED",
      blogTitle: "My Trial Blog 100th",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 0,
      likedByUsersList: [],
      likesCount: 0,
      profileID: "d6b57507-a31c-4553-b187-e5710897d233",
      profileName: "Adithya Narayan",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/v1628924598/Profile_Pic_male_mg0kie.jpg",
      timestamp: { $date: 1629099866456 },
      viewCount: 1,
    },
    {
      _id: { $oid: "60b33004d325b7158af1071f" },
      blogDescription:
        "asdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa.",
      blogID: "e6aacb55-b75f-4820-b851-e66827a6035a",
      blogImageURL:
        "http://res.cloudinary.com/dd8470vy4/image/upload/riocf3m3ne3jvlguocnk",
      blogStatus: "PUBLISHED",
      blogTitle: "from scratch 11",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 1,
      likedByUsersList: [],
      likesCount: 5,
      profileID: "96f59486-18b4-4f03-8923-9e4571e8e6b5",
      profileName: "rohan devaki",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/di9tmwjf9uwdjzjhk32w",
      timestamp: { $date: 1633187473509 },
      viewCount: 57,
    },
    {
      _id: { $oid: "610982f722c57d0170a580d5" },
      blogDescription:
        "My Trial Blog for Feed Testing,yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
      blogID: "e07f3d0d-eb8e-4d4e-b04d-e3d3ba7e860d",
      blogImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/tedyg2kmtgw7dkrhcq9r",
      blogStatus: "PUBLISHED",
      blogTitle: "Adithya Blog 1",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 0,
      likedByUsersList: [],
      likesCount: 1,
      profileID: "d6b57507-a31c-4553-b187-e5710897d233",
      profileName: "Adithya Narayan",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/v1628924598/Profile_Pic_male_mg0kie.jpg",
      timestamp: { $date: 1628013303709 },
      viewCount: 8,
    },
    {
      _id: { $oid: "611a175a3330d2d91b1e2f70" },
      blogDescription:
        "Jingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola Yokerajkaza",
      blogID: "6fd0db9c-0eb7-4f7c-967c-23b34dde813d",
      blogImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/tedyg2kmtgw7dkrhcq9r",
      blogStatus: "PUBLISHED",
      blogTitle: "My Trial Blog 100th",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 0,
      likedByUsersList: [],
      likesCount: 0,
      profileID: "d6b57507-a31c-4553-b187-e5710897d233",
      profileName: "Adithya Narayan",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/v1628924598/Profile_Pic_male_mg0kie.jpg",
      timestamp: { $date: 1629099866456 },
      viewCount: 1,
    },
    {
      _id: { $oid: "60b33004d325b7158af1071f" },
      blogDescription:
        "asdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa sasdf asfas asd fa sfasfa.",
      blogID: "e6aacb55-b75f-4820-b851-e66827a6035a",
      blogImageURL:
        "http://res.cloudinary.com/dd8470vy4/image/upload/riocf3m3ne3jvlguocnk",
      blogStatus: "PUBLISHED",
      blogTitle: "from scratch 11",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 1,
      likedByUsersList: [],
      likesCount: 5,
      profileID: "96f59486-18b4-4f03-8923-9e4571e8e6b5",
      profileName: "rohan devaki",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/di9tmwjf9uwdjzjhk32w",
      timestamp: { $date: 1633187473509 },
      viewCount: 57,
    },
    {
      _id: { $oid: "610982f722c57d0170a580d5" },
      blogDescription:
        "My Trial Blog for Feed Testing,yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
      blogID: "e07f3d0d-eb8e-4d4e-b04d-e3d3ba7e860d",
      blogImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/tedyg2kmtgw7dkrhcq9r",
      blogStatus: "PUBLISHED",
      blogTitle: "Adithya Blog 1",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 0,
      likedByUsersList: [],
      likesCount: 1,
      profileID: "d6b57507-a31c-4553-b187-e5710897d233",
      profileName: "Adithya Narayan",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/v1628924598/Profile_Pic_male_mg0kie.jpg",
      timestamp: { $date: 1628013303709 },
      viewCount: 8,
    },
    {
      _id: { $oid: "611a175a3330d2d91b1e2f70" },
      blogDescription:
        "Jingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola YokerajkazaJingli Lola Yokerajkaza",
      blogID: "6fd0db9c-0eb7-4f7c-967c-23b34dde813d",
      blogImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/tedyg2kmtgw7dkrhcq9r",
      blogStatus: "PUBLISHED",
      blogTitle: "My Trial Blog 100th",
      comments: [],
      dislikedByUsersList: [],
      dislikesCount: 0,
      likedByUsersList: [],
      likesCount: 0,
      profileID: "d6b57507-a31c-4553-b187-e5710897d233",
      profileName: "Adithya Narayan",
      profilePicImageURL:
        "https://res.cloudinary.com/dd8470vy4/image/upload/v1628924598/Profile_Pic_male_mg0kie.jpg",
      timestamp: { $date: 1629099866456 },
      viewCount: 1,
    },
  ],
};

export default Dashboard;
