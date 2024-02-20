"use client";

import Modal from "@/components/Modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<Modal title="Title test" description="This is a modal" onChange={() => {}} isOpen>
				This is something
			</Modal>
		</>
	);
};

export default ModalProvider;
