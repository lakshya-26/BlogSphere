import React, {useCallback, useState} from "react";
import {useForm} from "react-hook-form"
import Button from "../Button"
import Input from "../Input"
import RTE from "../RTE"
import Select from "../Select"
import appwriteSerice from "../../appwrite/config"
import {useSelector } from "react-redux"
import {useNavigate} from "react-router-dom"
import "./postForm.css"


export default function PostForm({post}){
    const [loading, setLoading] = useState(true);
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
            author: post?.author || "Anonymous", 

        }
    })
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)


    const submit = async(data) => {
        setLoading(false);
        if (post) {
            const file = data.image[0] ? await appwriteSerice.uploadFile(data.image[0]) : null

            if (file) {
                appwriteSerice.deleteFile(post.featuredImage)
            }
            const dbPost = await appwriteSerice.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined 
            })
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            const file = await appwriteSerice.uploadFile(data.image[0])
            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteSerice.createPost({...data, userId: userData.$id})

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
        setLoading(true);
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === "string") return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, '-')
        .replace(/\s/g, "-")
    }, [])

    React.useEffect(() => {
        watch((value, {name}) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), {shouldValidate: true})
            }
        }) 
    }, [watch, slugTransform, setValue])
    return loading ? (
        <form onSubmit={handleSubmit(submit)}
        className="flex flex-wrap"
        >
            <div className="w-full lg:w-2/3 px-2">
                <Input
                label="Title"
                placeholder="Title"
                className="mb-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                {...register("title", {required: true})}
                />
                <Input
                label="Slug :"
                placeholder="Slug"
                className="mb-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                {...register("slug", {required: true})}
                onInput={(e) => {
                    setValue("slug", slugTransform(e.currentTarget.value), {shouldValidate: true})
                }}
                />
                <RTE
                label="Content: "
                name="content"
                control={control}
                defaultValue={getValues("content")}
                />
                <Input 
                label="Author: "
                placeholder="Author's Name"
                className="mb-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                {...register("author")}
                />
            </div>
            <div className="w-full lg:w-1/3 px-2">
                <Input
                label="Featured Image"
                type="file"
                className="mb-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                accept="image/png, image/jpg, image/jpeg"
                {...register("image", {required: !post})}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img src={appwriteSerice.getFilePreview(post.featuredImage)} alt={post.title}
                        className="rounded-lg"
                        />
                        
                    </div>
                )}
                <Select
                options={["active", "inactive"]}
                label="Status"
                className="mb-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                {...register("status", {required: true})}
                />
                <Button
                type="submit"
                bgColor={post ? "bg-green-500": undefined}
                className="w-full"
                >{post ? "Update": "Submit"}</Button>
            </div>
        </form> ): (
    <div className="flex items-center justify-center mt-40 mb-40">
        <div className="loader-container-postForm">
        <div className="spinner-postForm"></div>
    </div>
    </div>
  )
}