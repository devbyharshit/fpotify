"use client";

import React from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

const Library = () => {
	const handleOnClick = () => {
		//on click open modal
	};

	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between px-5 pt-4">
				<div className="inline-flex items-center gap-x-2">
					<TbPlaylist className="text-neutral-400 " size={26} />
					<p className="text-neutral-400 font-medium text-md">Your Library</p>
				</div>
				<AiOutlinePlus className="text-neutral-400 hover:text-white transition cursor-pointer" size={20} onClick={handleOnClick} />
			</div>
            <div className="flex flex-col gap-y-2 mt-4 px-3">List of playlists</div>
		</div>
	); 
};

export default Library;
