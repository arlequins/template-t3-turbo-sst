import { loadAllPosts } from "../src/lib/content";

const posts = await loadAllPosts();
console.log(`Validated ${posts.length} localized MDX files`);
