import React, { useEffect, useRef, useState } from 'react';
import {
	Form,
	useActionData,
	useTransition,
	useSubmit,
} from '@remix-run/react';
import { type ActionArgs, json } from '@remix-run/cloudflare';

interface Chat {
	author: 'user' | 'ai';
	text: string;
}

interface ActionData {
	error?: string;
	response?: string;
}

export const action = async ({ context, request }: ActionArgs) => {
	const formData = await request.formData();
	const prompt = formData.get('prompt');
	const previousChats = formData.get('previous-chats') as string;
	const parsedChats = JSON.parse(previousChats) as Chat[];
	const latestChat = parsedChats.pop();

	const res = await fetch('https://api.openai.com/v1/completions', {
		method: 'POST',
		headers: {
			// Make sure you have set OPENAI_API_KEY in your top-level `.env` file
			Authorization: `Bearer ${context.OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			// `text-curie-001` is the second-best model. You can customize  which one
			// to use. See https://beta.openai.com/docs/models/gpt-3
			model: 'text-curie-001',
			temperature: 0.7,
			max_tokens: 100,
			// Customize this prompt based on the chatbot you want to create
			prompt: `You are [an all-knowing wizard] named [Oz] talking to [a visitor]. Respond with one sentence. [Talk like a professor].\nYou: ${latestChat?.text}\nThem: ${prompt}\nYou:`,
		}),
	});
	const { choices } = await res.json<{ choices: Array<{ text: string }> }>();
	if (choices.length === 0) {
		return json<ActionData>({ error: 'No choices returned' }, { status: 500 });
	}
	return json<ActionData>(
		{
			response: choices[0].text,
		},
		{ status: 200 }
	);
};

interface ChatBubbleProps {
	chat: Chat;
}
function ChatBubble({ chat }: ChatBubbleProps) {
	return (
		<div
			className={`${
				chat.author === 'ai' ? 'bg-blue-300' : 'bg-green-300'
			} w-3/4 p-3 rounded text-gray-900`}
		>
			{chat.text}
		</div>
	);
}

export default function Home() {
	const data = useActionData<ActionData>();
	const formRef = useRef<HTMLFormElement>(null);
	const chatsRef = useRef<HTMLUListElement>(null);
	const { state } = useTransition();

	const [chats, setChats] = useState<Chat[]>([
		{ author: 'ai', text: 'Hello, what would you like to ask me?' },
	]);

	const submit = useSubmit();
	function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && formRef.current) {
			e.preventDefault();
			submit(formRef.current, { replace: true });
		}
	}

	useEffect(() => {
		if (formRef.current && state === 'submitting') {
			const newUserChat: Chat = {
				author: 'user',
				text: formRef.current.prompt.value,
			};
			setChats([...chats, newUserChat]);
			formRef.current.reset();
		}
	}, [state]);

	useEffect(() => {
		if (data?.response) {
			const newAiChat: Chat = { author: 'ai', text: data.response };
			setChats([...chats, newAiChat]);
		}
	}, [data]);

	useEffect(() => {
		if (chats && chatsRef.current) {
			chatsRef.current?.scrollTo({
				top: chatsRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [chats]);

	return (
		<div className="flex flex-col items-center justify-start w-full h-screen">
			<div className="flex w-full md:max-w-md h-screen md:h-auto flex-col items-center justify-start py-4 px-4">
				<div className="flex flex-row items-center justify-start mt-4">
					<img
						src="/logo.png"
						width={80}
						height={80}
						className="rounded-2xl mr-4"
						alt="Logo"
					/>
					{/* Customize with your chatbot's name */}
					<h1>Talk to [Oz]</h1>
				</div>

				<div className="flex flex-col w-full h-[400px] md:h-[500px] p-2 bg-gray-800 border border-gray-600 rounded mt-8 overflow-y-scroll relative">
					<ul
						className="flex flex-col w-full h-full overflow-y-scroll space-y-4 pb-8"
						ref={chatsRef}
					>
						{chats.map((chat, index) => (
							<li
								key={index}
								className={`flex flex-row ${
									chat.author === 'ai' ? 'justify-start' : 'justify-end'
								}`}
							>
								<ChatBubble chat={chat} />
							</li>
						))}
					</ul>

					<Form method="post" ref={formRef} className="relative h-24">
						<textarea
							name="prompt"
							required
							className="w-full h-24 resize-none bg-gray-400 rounded p-3 pr-24 text-gray-900 placeholder:text-gray-600"
							placeholder="Start chatting with Garth..."
							onKeyDown={onKeyDown}
						></textarea>
						<button type="submit" className="absolute bottom-3 right-3">
							Send
						</button>
						<input
							type="hidden"
							name="previous-chats"
							value={JSON.stringify(chats)}
						/>
					</Form>
				</div>

				<div className="mt-8 text-sm text-gray-400 text-center">
					Made with [Make Your Own
					Chatbot](https://github.com/dgurns/make-your-own-chatbot)
				</div>
			</div>
		</div>
	);
}
