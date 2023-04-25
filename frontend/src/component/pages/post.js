async function Post() {
    console.log("asd");
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');
    console.log(postId);
}
export default Post;