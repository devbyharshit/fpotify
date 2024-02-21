"use client";

import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";

const UploadModal = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onClose } = useUploadModal();
	const { user } = useUser();
	const supabaseClient = useSupabaseClient();
	const router = useRouter();

	const { register, handleSubmit, reset } = useForm<FieldValues>({
		defaultValues: {
			author: "",
			title: "",
			song: null,
			image: null,
		},
	});

	const onChange = (open: boolean) => {
		if (!open) {
			reset();
			onClose();
		}
	};

	const onSubmit: SubmitHandler<FieldValues> = async (values) => {
		try {
			setIsLoading(true);

			const songFile = values.song?.[0];
			const imageFile = values.image?.[0];

			if (!imageFile || !songFile || !user) {
				toast.error("Missing fields");
				return;
			}

			const uniqueId = uniqid();

			// song upload
			const { data: songData, error: songError } = await supabaseClient.storage.from("songs").upload(`song-${values.title}-${uniqueId}`, songFile, {
				cacheControl: "3600",
				upsert: false,
			});

			if (songError) {
				setIsLoading(false);
				toast.error("Song upload failed.");
			}

			// image upload
			const { data: imageData, error: imageError } = await supabaseClient.storage.from("images").upload(`image-${values.title}-${uniqueId}`, imageFile, {
				cacheControl: "3600",
				upsert: false,
			});

			if (imageError) {
				setIsLoading(false);
				toast.error("Image upload failed.");
			}

			const { error: supabaseError } = await supabaseClient.from("songs").insert({
				user_id: user.id,
				title: values.title,
				author: values.author,
				image_path: imageData?.path,
				song_path: songData?.path,
			});

			if (supabaseError) {
				setIsLoading(false);
				return toast.error(supabaseError.message);
			}

			router.refresh();
			setIsLoading(false);
			toast.success("Song added.");
			reset();
			onClose();
		} catch (error) {
			toast.error("Somethin went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal title="Upload modal title" description="Upload modal description" isOpen={isOpen} onChange={onChange}>
			<form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
				<Input id="title" disabled={isLoading} {...register("title", { required: true })} placeholder="Song title" />
				<Input id="author" disabled={isLoading} {...register("author", { required: true })} placeholder="Song author" />
				<div>
					<div className="pb-1">Select a song</div>
					<Input id="song" type="file" accept=".mp3" disabled={isLoading} {...register("song", { required: true })} />
				</div>
				<div>
					<div className="pb-1">Select an image</div>
					<Input id="image" type="file" accept="image/*" disabled={isLoading} {...register("image", { required: true })} />
				</div>
				<Button disabled={isLoading} type="submit">
					Add
				</Button>
			</form>
		</Modal>
	);
};

export default UploadModal;
