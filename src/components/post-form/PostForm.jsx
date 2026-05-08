import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { RTE, Button, Input, Select } from '../index'
import  appwriteService  from '../../appwrite/appwrite_Config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PostForm({ post }) {
    const { register, control, handleSubmit, watch, setValue, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        }
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [selectedFile, setSelectedFile] = useState(null);

    const watchedImage = watch("image");

    useEffect(() => {
        if (watchedImage && watchedImage[0]) {
            setSelectedFile(watchedImage[0]);
        } else {
            setSelectedFile(null);
        }
    }, [watchedImage]);
    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

            if (file) {
                await appwriteService.deleteFile(post.featuredImage);
            }
            const dbPost = await appwriteService.updatePost(
                post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
                })
                if(dbPost) { 
                    navigate(`/post/${dbPost.$id}`); 
                }   
        }
        else{
            const file = await appwriteService.uploadFile(data.image[0]);
            if(file){
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.$id

                })
                if(dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
        }
    }
}

    const slugTransform = useCallback((value) => {
        if(value && typeof value === "string"){
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
        }
        return "";
    }
    ,[])

    useEffect(() => {
        const subscription = watch((value,{name})=>{
            if(name === "title"){
                setValue("slug",slugTransform(value.title,{shouldValidate:true}));
            }
        })
        return () => subscription.unsubscribe();
    },[watch,slugTransform, setValue])

    return (
                <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-6">
            <div className="w-full lg:w-3/4 px-4">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full lg:w-1/4 px-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                    }`}>
                        <input
                            type="file"
                            className="hidden"
                            id="image"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: !post })}
                        />
                        <label htmlFor="image" className="cursor-pointer">
                            {selectedFile ? (
                                <div className="text-green-600">
                                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="mt-1 text-sm font-medium">File selected: {selectedFile.name}</p>
                                    <p className="text-xs text-green-500">Click to change file</p>
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="mt-1 text-sm">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg w-full"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
        </div>
    
    );
}
