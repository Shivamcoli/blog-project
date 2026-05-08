import { useEffect, useState } from "react";
import { Container, Button } from "../components";
import appwriteService from "../appwrite/appwrite_Config";
import { useParams, Link, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { useSelector } from "react-redux";


export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="w-full flex justify-center mb-6 relative">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-64 md:h-80 object-cover"
                        />

                        {isAuthor && (
                            <div className="absolute right-6 top-6 flex space-x-2">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-500" className="px-4 py-2 text-white rounded-lg hover:bg-green-600 transition">
                                        Edit
                                    </Button>
                                </Link>
                                <Button bgColor="bg-red-500" onClick={deletePost} className="px-4 py-2 text-white rounded-lg hover:bg-red-600 transition">
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="p-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            {parse(post.content)}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}