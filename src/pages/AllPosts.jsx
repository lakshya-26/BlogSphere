import React from 'react'
import appwriteService from "../appwrite/config"
import { useState } from 'react'
import { useEffect } from 'react'
import Container from '../components/container/Container'
import PostCard from "../components/PostCard"
import "./allPosts.css"

function AllPosts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents)
      }
    })
  }, [])
  
  if (posts.length === 0) {
    return (
      <div className="loader-container-allPosts">
        <div className="spinner-allPosts"></div>
    </div>
    )
  }
  
  return (
    <div className='w-full py-8'>
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div className="p-2 w-1/4" key={post.$id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default AllPosts