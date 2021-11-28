import Link from "next/link";

interface PostFeedProps {
  posts;
  admin?;
}

export default function PostFeed({ posts, admin }: PostFeedProps) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

const PostItem = ({ post, admin = false }) => {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <br />
      <Link href={`/${post.username}/${post.slug}`}>
        <a>{post.title}</a>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} minutes to read.
        </span>
        <span>💗 {post.heartCount} Likes</span>
      </footer>
    </div>
  );
};
