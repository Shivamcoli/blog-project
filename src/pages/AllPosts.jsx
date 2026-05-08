import  appwriteService  from "../appwrite/appwrite_Config"
import {Container, PostCard} from '../components'
import { useEffect, useState } from "react";

function AllPosts() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
          appwriteService.getPosts().then((posts) => {
            if(posts)
            {
                setPosts(posts);
            }
        });
    }, [])
  

  return (
    <div className="py-8 w-full bg-gray-50 min-h-screen">
        <Container>
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    All Posts
                </h1>
                <p className="text-lg text-gray-600">
                    Browse through all our published articles
                </p>
            </div>
            <div className="flex flex-wrap">
                {
                    posts.map((post)=>(
                        <div key={post.$id} className="p-4 w-full sm:w-1/2 lg:w-1/2">
                            <PostCard {...post} />
                        </div>
                    ))
                }
            </div>
        </Container>
    </div>
  )
}

export default AllPosts