import { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/appwrite_Config'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([]);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts);
            }
        })
    }, []);

    if (!userData) {
        return (
            <div className="w-full py-8 mt-4 text-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                Welcome to Our Blog
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                Discover amazing stories and insights from our community.
                            </p>
                            <h2 className="text-2xl font-semibold text-purple-600 hover:text-purple-800 transition duration-200">
                                Please log in to read posts
                            </h2>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                No posts available yet
                            </h1>
                            <p className="text-lg text-gray-600">
                                Be the first to share your thoughts! Create a new post to get started.
                            </p>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full py-8 bg-gray-50 min-h-screen">
            <Container>
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Latest Posts
                    </h1>
                    <p className="text-lg text-gray-600">
                        Explore our collection of insightful articles
                    </p>
                </div>
                <div className="flex flex-wrap">
                    {posts.map((post) => (
                        <div key={post.$id} className="p-4 w-full sm:w-1/2 lg:w-1/2">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home