<script>
	import fs from 'fs';
	import savedMessages from './savedMessages.json';
	import { afterUpdate, tick } from 'svelte';
	let open = true;
	let messages = savedMessages;
	let chatContainer;
	let input = '';

	async function sendMessage() {
		if (!input.trim()) return;
		const message = input;
		input = '';

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message })
			});

			const data = await response.json();
			const { content } = data.messages;

			const messages = [...messages, { sender: 'system', text: content }];
			fs.writeFileSync('./src/lib/savedMessages.json', JSON.stringify(messages, null, 2));
			tick();
		} catch (error) {
			console.error('Error fetching embedding:', error);
		}
	}

	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
		}
	}

	afterUpdate(() => {
		scrollToBottom();
	});
</script>

<div
	class="fixed right-4 bottom-4"
	ondblclick={() => (open ? (open = false) : null)}
	role="button"
	tabindex="0"
>
	<button
		class=" rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg"
		onclick={() => (open = !open)}
	>
		💬
	</button>

	{#if open}
		<div
			class="fixed right-4 bottom-4 flex h-[50vh] w-[40vw] flex-col justify-between overflow-auto rounded-xl bg-gray-900 p-4 text-sm text-white shadow-xl"
		>
			<div class=" overflow-y-scroll" bind:this={chatContainer}>
				<div class="h-fill rounded-xl p-2 shadow-xl">
					{#each messages as msg}
						<div
							class="py-2 {msg.sender === 'system' ? 'text-right text-green-300' : 'text-left '}"
						>
							<p class="inline-block rounded-md bg-gray-700 px-2 py-1">{msg.text}</p>
						</div>
					{/each}
				</div>
				<div class="flex gap-2">
					<input
						type="text"
						class="flex-1 rounded-lg bg-gray-800 p-2 text-white"
						bind:value={input}
						onkeyup={(e) => e.key === 'Enter' && sendMessage()}
					/>
					<button class="rounded-lg bg-blue-500 px-3 py-2" onclick={sendMessage}>➡️</button>
				</div>
			</div>
		</div>
	{/if}
</div>
